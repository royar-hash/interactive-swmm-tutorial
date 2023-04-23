from flask import Flask, render_template, session
from flask_socketio import SocketIO, emit
from pyswmm import Simulation, Nodes, Links, RainGages
import pandas as pd
from datetime import datetime, timedelta
import json
import eventlet
eventlet.monkey_patch() # otherwise the for loop won't emit every time
import os

async_mode = None
app = Flask(__name__)
socketio = SocketIO(app, async_mode=async_mode)

flow_df = pd.DataFrame()
flow_df['name'] = ['CDT-15','EXISTING300','ORI-11','ORI-13']
flow_df['geoid'] = [1,2,3,4]

# prepare the baseline information for the storage node depth
baseline_depth = pd.read_csv('static/baseline_storage_depth.csv')
baseline_depth = baseline_depth.set_index('sim_step')
baseline_depth = baseline_depth.drop(['Unnamed: 0'], axis=1)

@app.route("/")
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

# when the start button is pressed, do many things
@socketio.on('start_button')
def handle_message(data):
    
    # if there are json files left over from previous simulation runs, remove them
    # this could happen if the simulation is stopped before it's complete
    if os.path.exists("gate_1.json"):
        os.remove("gate_1.json")
        
    if os.path.exists("gate_2.json"):
        os.remove("gate_2.json")
    
    # initialize the json files for the controllable assets - default is 0 so fully closed (matched to initial slider position)
    data = {"who": "gate_1_slider", "data": "0"}
    json_object = json.dumps(data)
    with open('gate_1.json', 'w') as outfile:
        outfile.write(json_object)    
    
    data = {"who": "gate_1_slider", "data": "0"}
    json_object = json.dumps(data)
    with open('gate_2.json', 'w') as outfile:
        outfile.write(json_object)    
        
    with Simulation('./model/model.inp') as sim: 
        
        # initialize the link and node objects
        link_object = Links(sim)
        node_object = Nodes(sim)
        
        # initialize the assets we want
        storage = node_object['DAM2']
        
        gate_1 = link_object['ORI-11']
        gate_2 = link_object['ORI-13']
        
        conduit_1 = link_object['EXISTING300']
        conduit_2 = link_object['CDT-15']
        
        step_counter = 0
        for step in sim:
            
            # grab, format, and emit the simulation percent complete
            percent_complete = round(sim.percent_complete*100,1)
            emit('percent_update',{'data':str(percent_complete)+'%'})
            
            # update the first gate status
            with open('gate_1.json', 'r') as f:
                gate_1_data = json.load(f)
            gate_1_string = gate_1_data.get('data')
            gate_1_setting = int(gate_1_string) / 100
            gate_1.target_setting = gate_1_setting
            emit('gate_1_update', {'data':gate_1.target_setting}) # we emit the target setting so that the slider value on the frontend isn't updated until the gate setting is updated on the backend
            
            # update the second gate status
            with open('gate_2.json', 'r') as f:
                gate_2_data = json.load(f)
            gate_2_string = gate_2_data.get('data')
            gate_2_setting = int(gate_2_string) / 100
            gate_2.target_setting = gate_2_setting
            emit('gate_2_update', {'data':gate_2.target_setting})

            # grab and emit flow information
            conduit_1_flow = conduit_1.flow 
            conduit_2_flow = conduit_2.flow 
            orifice_1_flow = gate_1.flow 
            orifice_2_flow = gate_2.flow 
            flow_list = [conduit_2_flow,conduit_1_flow,orifice_1_flow,orifice_2_flow] # MUST be in this exact order
            flow_df['flow'] = flow_list
            flow_json = flow_df.to_json(orient='records')
            emit('flow_update', flow_json)
                 
            # some stuff is slow, so we only want to do it every 50 timesteps
            if step_counter % 50 == 0:
                
                baseline = baseline_depth.iloc[step_counter]['depth'] # select the baseline flow corresponding to the current timestep from the dataframe
                storage_depth = storage.depth # grab the current depth of the storage node
                emit('baseline_update',baseline) 
                emit('storage_update',storage_depth)
                
                # grab and emit the 'flow at the outfall' info. if this is in the main loop, the numbers change so fast they look bad
                if conduit_1_flow < 0:
                    conduit_1_flow_emit = 0.0
                else:
                    conduit_1_flow_emit = conduit_1_flow
                    
                if conduit_2_flow < 0:
                    conduit_2_flow_emit = 0.0
                else:
                    conduit_2_flow_emit = conduit_2_flow
                emit('outfall_1_update',{'data':' '+str(round(conduit_1_flow_emit,2))+' m\N{SUPERSCRIPT THREE}/s'})
                emit('outfall_2_update',{'data':' '+str(round(conduit_2_flow_emit,2))+' m\N{SUPERSCRIPT THREE}/s'})
                
            step_counter = step_counter +1
            
            socketio.sleep(0.001) 
        
        # delete the json files for the controllable assets when the simulation is over
        os.remove('gate_1.json')
        os.remove('gate_2.json')
            
# when new slider information is recieved, stick that into the corresponding json file
@socketio.on('gate_1_change')
def handle_slider(data):
    json_object = json.dumps(data)
    with open('gate_1.json', 'w') as outfile:
        outfile.write(json_object)    
                                 
@socketio.on('gate_2_change')
def handle_slider(data):
    json_object = json.dumps(data)
    with open('gate_2.json', 'w') as outfile:
        outfile.write(json_object) 
        
# run the app    
if __name__ == '__main__':
    socketio.run(app,debug=True)
    #app.run()
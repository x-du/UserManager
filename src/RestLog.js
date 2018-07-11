	import React, { Component } from 'react';

	//react component to display all rest api calls in a simple unordered list.
	export class RestLog extends Component {

		constructor(props){
			super(props);
			this.listen();
		}

		//listener function for all xhr calls
		listen() {
			var ajaxListener = {};
			ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
			ajaxListener.tempSend = XMLHttpRequest.prototype.send;
			ajaxListener.callback = function () {
				// this.method :the ajax method used
				// this.url    :the url of the requested script (including query string, if any) (urlencoded) 
				// this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)

				//filters xhr calls to only display calls made using the rest api. This can be modified to display more/less info.
				if (this.url.includes('api/')) {
					RestLog.log(this.method, this.url.split('api/')[0] + "api/", this.data, this.url.split('api/')[1]);
				}
			}		

			XMLHttpRequest.prototype.open = function(a="",b="") {
				ajaxListener.tempOpen.apply(this, arguments);
				ajaxListener.method = a;  
				ajaxListener.url = b;
				if (a.toLowerCase() === 'get') {
					ajaxListener.data = b.split('?');
					ajaxListener.data = ajaxListener.data[1];
				}
			}

			XMLHttpRequest.prototype.send = function(a="",b="") {
				ajaxListener.tempSend.apply(this, arguments);
				if(ajaxListener.method.toLowerCase() === 'post')ajaxListener.data = a;
				ajaxListener.callback();
			}
		}

		//log of all xhr calls
		static messageLog = [];

		//function to write to log
		static log(method="N/A", url="N/A", data="N/A", message="") {
			this.messageLog.push({method: method, url: url, message: message, data: data});
		}

		//resets log of api calls and clears div
		static clear() {
			RestLog.messageLog = [];
			this.forceUpdate();
		}

		render() {
			return (
				<div>
					<button onClick={RestLog.clear.bind(this)}>clear</button>

			        <ul>
			            {RestLog.messageLog ? 
		                	(RestLog.messageLog.map(function(request, i){
		                		return <li key={request.method + i}> <b>{request.method}:</b> {request.url}<b>{request.message}</b> <br/>
		                		</li>;})
			                ) : (<li>No REST calls yet</li>)}
			        </ul>
		        </div>
			) 
		}
	}
/* global chrome */
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import App from './App';
import "./index.css";
// style sheet manager injects styled components into iframe
// http://stephenhaney.com/using-styled-components-iframes-react/
import { StyleSheetManager } from 'styled-components';

// content.js is the content script for the extension:
// https://developer.chrome.com/extensions/content_scripts
class Main extends React.Component {
    render() {
        // TODO(rdg) loading assets like the svg is a whole thing. Should figure out before adding icons or anything else.
        // Using an iframe isolates styles and events in the extension:
        // https://stackoverflow.com/questions/12783217/how-to-really-isolate-stylesheets-in-the-google-chrome-extension 
        return (
            <Frame head={[
                <link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} />,
              ]}> 
               <FrameContextConsumer>
                { frameContext => (
                  <StyleSheetManager target={frameContext.document.head}>
                    <App />
                  </StyleSheetManager>
                )}
              </FrameContextConsumer>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
   if(app.style.display === "none"){
     app.style.display = "block";
   }else{
     app.style.display = "none";
   }
}

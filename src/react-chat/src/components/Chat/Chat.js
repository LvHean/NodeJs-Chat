import React, { Component, useState, useEffect, useLocation, useRef } from 'react';
import axios from "axios";

import * as SharedFunctions from '../../lib/SharedFunctions'
import { API_BASE_URL, SOCKET_BASE_URL, API_TOKEN, USER_ID } from "../../constants/api_constants";

import useWebSocket, { ReadyState } from "react-use-websocket"

function Chat(props) {
  let messageInput = useRef()
  let messagesRefs = useRef([]);

  const { sendJsonMessage, readyState } = useWebSocket(SOCKET_BASE_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
      sendJsonMessage({
        action: "login",
        sender_id: localStorage.getItem(USER_ID)
      })
    },
    onMessage: (event) => {
      let jsonObject = JSON.parse(event.data)
      if (jsonObject['action'] == 'new_message') {
        getAllChats()
      }
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  useEffect(() => {
    getAllChats()
  }, [])

  const [state, setState] = useState({
    chats: []
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value.length == 0) {
        setState((prevState) => ({
          ...prevState,
        }));
      } else {
        const payload = {
          receiver_id: props.location.state.receiver_id,
          message: e.target.value
        };
        const headers = {
          "Content-Type": "application/json; charset=UTF-8",
          'CHAT_TOKEN': localStorage.getItem(API_TOKEN)
        }
        axios
          .post(API_BASE_URL + "/send_chat", payload, { headers })
          .then(function (response) {
            if (response.status === 200) {
              let responseData = response.data
              let responseStatus = responseData['status']
              if (responseStatus == 1) {
                getAllChats();
              }
              messageInput.value = ""
              props.showError(null);
            } else {
            }
          })
          .catch(function (error) {
          });
      }
    }
  }

  const getAllChats = () => {
    const headers = {
      'CHAT_TOKEN': localStorage.getItem(API_TOKEN)
    }
    axios
      .get(API_BASE_URL + "/get_chats/" + props.location.state.receiver_id, { headers })
      .then(function (response) {
        if (response.status === 200) {
          let responseData = response.data
          let responseStatus = responseData['status']
          if (responseStatus == 1) {
            setState((prevState) => ({
              ...prevState,
              chats: responseData['data'],
            }));
          }
          scrollToBottom()
          props.showError(null);
        } else {
        }
      })
      .catch(function (error) {
      });
  }

  const scrollToBottom = () => {
    messagesRefs.current[messagesRefs.current.length - 1].scrollIntoView({ behavior: "smooth", inline: 'start', block: 'center' });
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'block' }}>
      <div className="bg-lightest-blue" style={{ width: '100vw', height: '75px', position: "fixed", display: 'flex', alignItems: "center", justifyContent: "center" }}>
        <button
          style={{ width: '100px', height: '35px', float: 'top', position: 'fixed', top: '20px', left: "20px" }}
          type="button"
          onClick={() => { props.navigate("/home") }}>Back</button>
        <h2 className="f2" style={{ textAlign: "center" }}>{props.location.state.receiver_name}</h2>
      </div>

      <div style={{ width: '100vw', height: 'fit-content', display: "inline-block", marginBottom: '40px', paddingBottom: '40px', marginTop: '75px', overflowX: 'scroll' }}>
        {
          state.chats.map((chat, index) =>
            chat.sender_id == localStorage.getItem(USER_ID)
              ? <div ref={el => (messagesRefs.current[index] = el)} className="tc br3 bg-light-blue pa3" style={{ width: 'fit-content', maxWidth: '80vw', height: 'fit-content', margin: '10px', marginLeft: "auto", right: '10px', whiteSpace: 'pre', textAlign: "right", scrollMargin: '100px' }}> {chat.message} </div>

              : <div ref={el => (messagesRefs.current[index] = el)} className="tc br3 bg-light-green pa3" style={{ width: 'fit-content', maxWidth: '80vw', height: 'fit-content', margin: '10px', whiteSpace: 'pre', scrollMargin: '100px' }}> {chat.message} </div>
          )
        }
        {/* <div style={{ float:"left", clear: "both" }}
             ref={(el) => { messagesRefs.current[state.chats.length] = el }}>
        </div> */}
      </div>

      <div>
        <input
          ref={el => messageInput = el}
          className="pa3 bb b--none bg-lightest-blue"
          style={{ width: '100vw', height: '50px', float: 'bottom', position: 'fixed', bottom: '0px' }}
          type="search"
          placeholder="Enter message here ..."
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default SharedFunctions.withRouter(Chat);

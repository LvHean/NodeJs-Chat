import React, { Component, useState, useEffect } from 'react';
import axios from "axios";

import * as SharedFunctions from '../../lib/SharedFunctions'
import { API_BASE_URL, API_TOKEN, USER_ID, USER_NAME } from "../../constants/api_constants";
import Scroll from './Scroll';
import Card from './Card';
import ConversationCard from './ConversationCard';

function Home (props) {

  useEffect(()=>{
    getAllConversations()
  }, []) 

  // localStorage.removeItem(USER_ID);
  // localStorage.removeItem(USER_NAME);
  // localStorage.removeItem(API_TOKEN);

  const [state, setState] = useState({
    searchField: "",
    searchShow: "",
    searchResults: [],
    conversations: []
  });

  const filteredPersons = state.searchResults.filter(
    person => {
      return (
        person
          .name
          .toLowerCase()
          .includes(state.searchField.toLowerCase()) ||
        person
          .email
          .toLowerCase()
          .includes(state.searchField.toLowerCase())
      );
    }
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value.length == 0) {
        setState((prevState) => ({
          ...prevState,
          searchResults: [],
          searchShow: false
        }));
      } else {
        const payload = { 'name': e.target.value };
        const headers = {
          "Content-Type": "application/json; charset=UTF-8",
          'CHAT_TOKEN': localStorage.getItem(API_TOKEN)
        }
        axios
          .post(API_BASE_URL + "/search_user", payload, { headers })
          .then(function (response) {
            if (response.status === 200) {
              let responseData = response.data
              let responseStatus = responseData['status']
              if (responseStatus == 1) {
                setState((prevState) => ({
                  ...prevState,
                  searchResults: responseData['data'],
                  searchShow: true
                }));
              }
              props.showError(null);
            } else {
              props.showError("Invalid request 2");
            }
          })
          .catch(function (error) {
            props.showError("Invalid request 1");
          });
      }
    }
  }

  const getAllConversations = () => {
    const headers = {
      'CHAT_TOKEN': localStorage.getItem(API_TOKEN)
    }
    axios
      .get(API_BASE_URL + "/get_conversations", { headers })
      .then(function (response) {
        if (response.status === 200) {
          let responseData = response.data
          let responseStatus = responseData['status']
          if (responseStatus == 1) {
            setState((prevState) => ({
              ...prevState,
              conversations: responseData['data'],
            }));
          }
          props.showError(null);
        } else {
        }
      })
      .catch(function (error) {
      });
  }

  const onCardDidClick = (index) => {
    props.navigate("/chat", { state: { receiver_id: state.searchResults[index]['_id'], receiver_name: state.searchResults[index]['name'] } });

  }

  const onConversationCardDidClick = (index) => {
    props.navigate("/chat", { state: { receiver_id: state.conversations[index]['receiver_id'], receiver_name: state.conversations[index]['receiver_name'] } });
  }

  function searchList() {
    if (state.searchShow) {
      return (
        <Scroll>
          {
          filteredPersons.map((person, index) => <Card key={person._id} index={index} person={person} onClick={onCardDidClick} />)
          }
        </Scroll>
      );
    }
  }

  function conversationList() {
    return (
      <Scroll>
        {
        state.conversations.map((person, index) => <ConversationCard key={person._id} index={index} person={person} onClick={onConversationCardDidClick} />)
        }
      </Scroll>
    );
  }

  return (
    <div style={{ width: '100vw', display: 'block' }}>
      <div style={{ width: '40vw', display: "inline-block", marginLeft: "5vw", marginRight: "5vw" }}>
        <section className="garamond">
          <div className="navy georgia">
            <h2 className="f2" style={{ textAlign: "center" }}>Search User</h2>
          </div>
          <div className="">
            <input
              className="pa3 bb br3 b--none bg-lightest-blue"
              style={{ width: '40vw', marginBottom: '10px' }}
              type="search"
              placeholder="User name"
              onKeyDown={handleKeyDown}
            />
          </div>
          {searchList()}
        </section>
      </div>
    
      <div style={{ float: 'right', width: '40vw', height: "100vh", display: "inline-block",marginLeft: "5vw", marginRight: "5vw"  }}>
        <section className="garamond">
          <div className="navy georgia ma0">
            <h2 className="f2" style={{ textAlign: "center" }}>Chat List</h2>
          </div>
          {conversationList()}

        </section>

      </div>
    </div>
  );
}

export default SharedFunctions.withRouter(Home);

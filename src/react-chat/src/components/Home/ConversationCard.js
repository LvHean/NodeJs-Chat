import React from 'react';
import { API_BASE_URL, API_TOKEN, USER_NAME, USER_ID } from "../../constants/api_constants";

const ConversationCard = (props) => {

	const itemPressed = () => {
		props.onClick(props.index)
	}
	return(
		<div className="tc bg-light-green pa3" style={{width:'40vw', marginBottom: '10px'}} onClick={itemPressed}>
			<div style={{width:'40vw'}}>
				<h2>{props.person.receiver_name}</h2>
				<p>{ (props.person.last_message_sender_id == localStorage.getItem(USER_ID)) ? 'You: ' : ''}{props.person.last_message}</p>
			</div>
		</div>
	);
}

export default ConversationCard;
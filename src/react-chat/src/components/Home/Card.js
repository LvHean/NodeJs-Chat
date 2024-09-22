import React from 'react';

const Card = (props) => {
	const itemPressed = () => {
		props.onClick(props.index)
	}

	return(
		<div className="tc bg-light-green pa3" style={{width:'40vw', marginBottom: '10px'}} onClick={itemPressed}>
			<div style={{width:'40vw'}}>
				<h2>{props.person.name}</h2>
				<p>{props.person.email}</p>
			</div>
		</div>
	);
}

export default Card;
import React from 'react';

const Scroll = (props) => {
	return(
		<div style={{ overflowX: 'scroll', width:'40vw'}}>
			{props.children}
		</div>
	);
}

export default Scroll;
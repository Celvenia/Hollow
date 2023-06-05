import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';



function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className='flex-row nav-container'>
			<li>
				<NavLink exact to="/">Home</NavLink>
			</li>
			<li>
				<NavLink exact to="/messages">Messages</NavLink>
			</li>
			<li>
				<NavLink exact to="/notes">Notes</NavLink>
			</li>
			<li>
				<NavLink exact to="/reminders">Reminders</NavLink>
			</li>
			<li>
				<NavLink exact to="/alarms">Alarms</NavLink>
			</li>
			<li>
				<NavLink exact to="/testing">Testing</NavLink>
			</li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
		</ul>
	);
}

export default Navigation;
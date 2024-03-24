import { useState } from 'react';
import { Form } from './components/Form';
import { List } from './components/List';

import './App.css';

const initialPeople = [
	{
		name: 'Jan Kowalski',
		age: 30,
		contact: {
			tel: '+48555666777',
			email: 'jan.kowalski@gmail.com',
		},
		nip: '0000000001',
	},
	{
		name: 'Janina Kowalska',
		age: 25,
		contact: {
			tel: '+48333222111',
			email: 'janina.kowalska@o2.com',
		},
	},
];

function App() {
	const [people, setPeople] = useState(initialPeople);

	return (
		<div className='container'>
			<Form
				onAddPerson={(person) => {
					setPeople((prevPeople) => [...prevPeople, person]);
				}}
			/>
			<List data={people} />
		</div>
	);
}

export default App;

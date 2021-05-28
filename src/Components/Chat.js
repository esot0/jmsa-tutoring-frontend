import React, { useEffect, useContext, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { axios_instance } from '..';
import Select from 'react-select';
import jwt_decode from 'jwt-decode'
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import { parseDate, verifyJWT } from '../utility'
import io from 'socket.io-client'
import { SocketContext } from '../Hooks/socketContext'

const Chat = () => {
	const jwt = verifyJWT();

	const socket = useContext(SocketContext);
	const { username } = useParams();
	const [messages, set_messages] = useState({
		offset: 0,
		recipient: undefined,
		displayed: [],
		messages: []
	});

	const [user_list, set_user_list] = useState([]);
	const [loading, setLoading] = useState(false);
	const perPage = 30;
	let pageCount = Math.ceil(messages.messages.length) / perPage;

	const handleReceiveMessage = useCallback((msg) => {
		const id = jwt.id.replace(/['"]+/g, '');
		if (id == msg.recipient.$oid) {
			set_messages((previous_messages) => {
				const newArr = [...previous_messages.messages, msg]
				return {
					offset: previous_messages.offset,
					recipient: previous_messages.recipient,
					displayed: (previous_messages.offset + perPage >= newArr.length ? newArr.slice(previous_messages.offset, newArr.length) : newArr.slice(previous_messages.offset, previous_messages.offset + perPage)),
					messages: newArr
				}
			})

		}
	}, [])




	useEffect(() => {
		set_messages({
			...messages,
			displayed: (messages.offset + perPage >= messages.messages.length ? messages.messages.slice(messages.offset, messages.messages.length) : messages.messages.slice(messages.offset, messages.offset + perPage))
		})
	}, [messages.offset])


	useEffect(() => {
		if (jwt.rls.includes('student') && jwt.rls.includes('tutor')) {
			axios_instance.get('/user')
				.then(function (response) {
					return response.data.filter(user => user.username != username)
				})
				.then((res) => {
					set_user_list([...user_list, ...res])
				})
				.catch(function (error) {
					console.log(error);
				});
		}

		else if (jwt.rls.includes('tutor')) {
			axios_instance.get('/user/students')
				.then(function (response) {
					return response.data.filter(user => user.username != username)
				})
				.then((res) => {
					set_user_list([...user_list, ...res])
				})
				.catch(function (error) {
					console.log(error);
				});
		}

		else if (jwt.rls.includes('student')) {
			axios_instance.get('/user/tutors')
				.then(function (response) {
					return response.data.filter(user => user.username != username)
				})
				.then((res) => {
					set_user_list([...user_list, ...res])
				})
				.catch(function (error) {
					console.log(error);
				});
		}
		socket.on("msg", handleReceiveMessage)
		return () => {
			socket.disconnect();
		};
	}, [])

	useEffect(() => {
		//Getting called faultily after a message is recieved
		if (messages.recipient && messages.recipient.username != undefined) {
			new Promise((resolve, reject) => {
				resolve(setLoading(true))
			})
				.then
				(() => axios_instance.get(`/user/${username}/chat/${messages.recipient._id.$oid}`))
				.then((res) => {
					if (res.data) {
						set_messages({...messages, offset: 0, displayed: perPage >= res.data.length ? res.data.slice(0, res.data.length) : res.data.slice(0, perPage), messages: [...res.data] });
					}
				})
				.then(() => {
					setLoading(false);
				})
				.catch((err) => {
					console.log(err)
				})
		}
	}, [messages.recipient])


	const handleSubmit = (e) => {

		e.preventDefault();
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const message = {
			recipient: messages.recipient._id.$oid,
			body: e.target.message.value,
			sender: jwt_decode(localStorage.getItem("token")).id
		}

		axios_instance.post(`/user/${username}/chat/${messages.recipient._id.$oid}`, message, config)
			.then((res) => {
				const newArr = [...messages.messages, res.data]
				set_messages({
					...messages,
					displayed: (messages.offset + perPage >= newArr.length ? newArr.slice(messages.offset, newArr.length) : newArr.slice(messages.offset, messages.offset + perPage)),
					messages: newArr
				});


				return res.data;
			})
			.then((res) => {
				socket.emit("msg", res)
			})
			.catch((err) => {
				console.log(err)
			})

	}

	const handleSelect = (selected) => {
		set_messages({ ...messages, recipient: selected })
	}

	const handlePageClick = (e) => {
		let selected = e.selected;
		let offset = Math.ceil(selected * perPage);
		set_messages({...messages, offset: offset});
	};

	const message_list = messages.displayed.map((message) => {

		let message_class =  messages.recipient._id.$oid == message.sender.$oid ? "recieved" : "sent";

		const date = new Date(message.timestamp.$date);

		const timestamp = parseDate(date)

		return (
			<div key={message._id.$oid} className={`message ${message_class}`}>
				<span className="message_text">{message.body}</span>
				<span className="message_time">{timestamp}</span>

			</div>)
	})


	return (
		<Form onSubmit={handleSubmit} className="form-comp">
			{messages.recipient ? <div>
				<h2 className="username">{messages.recipient.username}</h2>
				{loading && <ReactLoading type={"spin"} color={"white"} height={'10%'} width={'10%'} className="loading_spinner" />}
				<div >{message_list.length !== 0 ?
					<div className="message_list">
						{message_list}
						< ReactPaginate
							pageCount={pageCount}
							pageRangeDisplayed={5}
							marginPagesDisplayed={5}
							onPageChange={handlePageClick}
							containerClassName={'pagination'}
							subContainerClassName={'pages pagination'}
							activeClassName={'active'}
							previousLabel={'Previous'}
							nextLabel={'Next'}
							breakLabel={'...'}
						/>
					</div> :
					<span class="flavor-text">Start a conversation</span>}</div>
			</div>
				: <div> <h1>Chat</h1><span class="flavor-text">Select someone to chat with.</span></div>}

			<div className="message-form-input">
				<div>
					<Select
						menuPortalTarget={document.querySelector('body')}
						maxMenuHeight={220}
						classNamePrefix="react-select"
						className="select center"
						onChange={handleSelect}
						options={user_list}
						getOptionLabel={(option) => option.username}
						getOptionValue={(option) => option._id}
					/>
				</div>
				{messages.recipient && (
					<div>
						<Form.Group controlId="message">
							<Form.Control type="text" placeholder="Message" />
						</Form.Group>
						<Button type="submit">Send</Button>
					</div>)}
			</div>
		</Form>
	)
}

export default Chat;
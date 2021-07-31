import React from 'react'
import io from 'socket.io-client'
import { SITE_ROOT } from '../utility';
export const socket = io.connect(`${SITE_ROOT}`)
export const SocketContext = React.createContext();

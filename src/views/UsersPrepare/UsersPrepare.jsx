import styles from './UsersPrepare.module.scss'

import { setUsers, setMessage, setQuery, pushUsersDone, resetUsersDone, shiftUser } from '../../store/appSlice'
import { debounce } from 'lodash'

import { Input, Typography, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { telegramClient } from '../../api'
import { useEffect } from 'react'
const { TextArea } = Input
const { Text } = Typography

export function UsersPrepare () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useSelector(state => state.appSlice.query)
  const users = useSelector(state => state.appSlice.users)
  const message = useSelector(state => state.appSlice.message)
  const usersIsFetching = useSelector(state => state.appSlice.usersIsFetching)

  let running = false
  useEffect(() => {
    if (!running) {
      if (users.length) {
        running = true
        navigate('/inProgress')
        sendMessages()
      }
    }
  }, [users])

  const debouncedHandler = debounce((callback, value) => { dispatch(callback(value)) }, 300)

  function onUsersChangeHandler (e) {
    debouncedHandler(setMessage, e.target.value)
  }

  function onQueryChangeHandler (e) {
    debouncedHandler(setQuery, e.target.value)
  }

  async function sendMessage (user) {
    dispatch(shiftUser())
    await telegramClient.sendMessage(user, message)
    dispatch(pushUsersDone(user))
  }

  async function sendMessages () {
    const usersToSend = [...users]
    dispatch(resetUsersDone())
    for (const user of usersToSend) {
      await sendMessage(user)
    }
  }

  return (
    <section className={styles.section}>
      <h2>Finally, fill remaining fields</h2>
      <div className={styles.inputWrapper}>
        <TextArea placeholder="Message" autoSize={{ minRows: 2, maxRows: 6 }} onChange={onUsersChangeHandler} />
        <div className={styles.inputWrapperUsers}>
        <TextArea placeholder="Users / Channels" autoSize={{ minRows: 2, maxRows: 6 }} onChange={onQueryChangeHandler} />
        <Text type="danger">*Channels must be marked with :channel suffix, for example @name:channel</Text>
        </div>
        <Button type='primary' onClick={() => dispatch(setUsers(query))} disabled={usersIsFetching} loading={usersIsFetching}>Send messages</Button>
      </div>
    </section>
  )
}

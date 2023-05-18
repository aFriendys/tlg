import styles from './UsersPrepare.module.scss'

import { setUsers, setMessage, setQuery, pushUsersDone, resetUsersDone, shiftUser, pushUsersError } from '../../store/appSlice'
import { debounce } from 'lodash'

import { Input, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { telegramClient } from '../../api'
import { useEffect, useRef } from 'react'
import { sleep } from '../../functions/functions'
const { TextArea } = Input

export function UsersPrepare () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useSelector(state => state.appSlice.query)
  const users = useSelector(state => state.appSlice.users)
  const message = useSelector(state => state.appSlice.message)
  const usersIsFetching = useSelector(state => state.appSlice.usersIsFetching)
  const running = useRef(false)

  useEffect(() => {
    if (!running.current && users.length) {
      running.current = true
      navigate('/inProgress')
      sendMessages()
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
    try {
      await sleep(300)
      await telegramClient.sendMessage(user, message)
      dispatch(pushUsersDone(user))
    } catch {
      dispatch(pushUsersError(user))
      return false
    }
    return true
  }

  async function sendMessages () {
    let messagesSent = 0
    const usersToSend = [...users]
    dispatch(resetUsersDone())
    for (const user of usersToSend) {
      const result = await sendMessage(user)
      if (result) {
        messagesSent = messagesSent + 1
      }
    }
    console.log(messagesSent)
  }

  return (
    <section className={styles.section}>
      <h2>Заполните оставшиеся поля</h2>
      <div className={styles.inputWrapper}>
        <TextArea placeholder="Сообщение" autoSize={{ minRows: 2, maxRows: 6 }} onChange={onUsersChangeHandler} />
        <TextArea placeholder="Пользователи / каналы" autoSize={{ minRows: 2, maxRows: 6 }} onChange={onQueryChangeHandler} />
        <Button type='primary' onClick={() => dispatch(setUsers(query))} disabled={usersIsFetching} loading={usersIsFetching}>Отправить сообщения</Button>
      </div>
    </section>
  )
}

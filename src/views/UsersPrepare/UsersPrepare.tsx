import { type BaseSyntheticEvent, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import { Input, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import styles from './UsersPrepare.module.scss'

import { telegramClient } from 'api'
import { sleep } from 'functions'
import { type IAppDispatch, setUsers, setMessage, setQuery, pushUsersDone, resetUsersDone, shiftUser, pushUsersError, type IRootState } from 'store'

const { TextArea } = Input

export function UsersPrepare (): JSX.Element {
  const dispatch = useDispatch<IAppDispatch>()
  const navigate = useNavigate()
  const query = useSelector<IRootState, string>(({ app: { query } }) => query)
  const users = useSelector<IRootState, string[]>(({ app: { users } }) => users)
  const message = useSelector<IRootState, string>(({ app: { message } }) => message)
  const inProgress = useSelector<IRootState, boolean>(({ app: { inProgress } }) => inProgress)
  const running = useRef(false)

  useEffect(() => {
    if (!running.current && users.length > 0) {
      running.current = true
      navigate('/inProgress')
      sendMessages()
    }
  }, [users])

  const debouncedHandler = debounce((callback, value) => { dispatch(callback(value)) }, 300)

  function onUsersChangeHandler (e: BaseSyntheticEvent): void {
    debouncedHandler(setMessage, e.target.value)
  }

  function onQueryChangeHandler (e: BaseSyntheticEvent): void {
    debouncedHandler(setQuery, e.target.value)
  }

  async function sendMessage (user: string): Promise<boolean> {
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

  async function sendMessages (): Promise<void> {
    let messagesSent = 0
    let messagesError = 0
    const usersToSend = [...users]
    dispatch(resetUsersDone())
    for (const user of usersToSend) {
      const result = await sendMessage(user)
      if (result) {
        messagesSent++
      } else {
        messagesError++
      }
    }
    console.group('Результат отправки сообщений')
    console.log('Отправлено сообщений:', messagesSent)
    console.log('Не отправлено сообщений:', messagesError)
    console.groupEnd()
  }

  return (
    <section className={styles.section}>
      <h2>Заполните оставшиеся поля</h2>
      <div className={styles.inputWrapper}>
        <TextArea placeholder="Сообщение" autoSize={{ minRows: 2, maxRows: 6 }} onChange={onUsersChangeHandler} />
        <TextArea placeholder="Пользователи / каналы" autoSize={{ minRows: 2, maxRows: 6 }} onChange={onQueryChangeHandler} />
        <Button type='primary' onClick={(): void => { dispatch(setUsers(query)) }} disabled={inProgress} loading={inProgress}>Отправить сообщения</Button>
      </div>
    </section>
  )
}

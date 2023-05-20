import { ArrowRightOutlined } from '@ant-design/icons'
import { Input, Button } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setInProgress } from 'store'
import { type IApp } from 'types'

import styles from './UsersInProgress.module.scss'

const { TextArea } = Input

export function UsersInProgress (): JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usersInProgress = useSelector<{ app: IApp }, string[]>(({ app: { users } }) => users)
  const usersDone = useSelector<{ app: IApp }, string[]>(({ app: { usersDone } }) => usersDone)
  const usersError = useSelector<{ app: IApp }, string[]>(({ app: { usersError } }) => usersError)

  useEffect(() => {
    dispatch(setInProgress(false))
  }, [])

  return (
    <section className={styles.section}>
      <h2>Сообщения отправляются</h2>
      <div className={styles.inputWrapper}>
        <div className={styles.inputWrapperTextarea}>
          <TextArea
            readOnly
            autoSize={{ minRows: 16, maxRows: 16 }}
            className={styles.input}
            value={usersInProgress.join(' ')}
          />
          <ArrowRightOutlined />
          <div className={styles.doneWrapper}>
            <TextArea
              readOnly
              autoSize={{ minRows: 8, maxRows: 8 }}
              className={styles.input}
              value={usersDone.join(' ')}
            />
            <TextArea
              readOnly
              autoSize={{ minRows: 8, maxRows: 8 }}
              className={styles.input}
              value={usersError.join(' ')}
            />
          </div>
        </div>
        <Button
          type="primary"
          className={styles.button}
          disabled={usersInProgress.length > 0}
          loading={usersInProgress.length > 0}
          onClick={() => {
            navigate('/prepare')
          }}
        >
          Назад
        </Button>
      </div>
    </section>
  )
}

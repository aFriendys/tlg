/* eslint-disable no-unused-vars */
import { ArrowRightOutlined } from '@ant-design/icons'
import { Input, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import styles from './UsersInProgress.module.scss'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input

export function UsersInProgress () {
  const navigate = useNavigate()
  const usersInProgress = useSelector((state) => state.appSlice.users)
  const usersDone = useSelector((state) => state.appSlice.usersDone)
  const usersError = useSelector((state) => state.appSlice.usersError)

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
          disabled={usersInProgress.length}
          loading={usersInProgress.length}
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

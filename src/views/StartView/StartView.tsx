/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Input, Button, Modal } from 'antd'
import { useLocalStorage } from '../../hooks'
import { telegramClient } from '../../api'

import styles from './StartView.module.scss'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setInProgress } from '../../store/appSlice'
import { setUserName } from '../../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { applyMiddleware } from 'redux'

export function StartView (): JSX.Element {
  const dispatch = useDispatch()
  const [apiId, setApiId] = useLocalStorage('apiId', '')
  const [apiHash, setApiHash] = useLocalStorage('apiHash', '')
  const [phone, setPhone] = useLocalStorage('phone', '')
  const [password, setPassword] = useLocalStorage('password', '')
  const [code, setCode] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const navigate = useNavigate()
  const inProgress = useSelector(({ app }: { app: any }) => app.inProgress)
  const onSubmitHandler = async (e: React.SyntheticEvent): Promise<any> => {
    dispatch(setInProgress(true))
    await telegramClient.createClient(apiId, apiHash)
    await telegramClient.sendCode(phone)
    setModalIsOpen(() => true)
  }

  useEffect(() => {
    (async () => {
      const [connected, { firstName }] =
        await telegramClient.tryToStartClient()
      if (connected) {
        dispatch(setUserName(firstName))
        navigate('/prepare')
      }
    })()
    dispatch(setInProgress(false))
  }, [])

  return (
    <>
      <section className={styles.section}>
        <h2>
          Зарегистрируйте приложение{' '}
          <a
            href="https://my.telegram.org/apps"
            target="_blank"
            rel="noreferrer"
          >
            тут
          </a>{' '}
          и введите данные ниже
        </h2>
        <div className={styles.inputWrapper}>
          <h3>Приложение</h3>
          <Input
            size="large"
            placeholder="App id"
            value={apiId}
            onChange={(e) => setApiId(e.target.value)}
          />
          <Input
            size="large"
            placeholder="App hash"
            value={apiHash}
            onChange={(e) => setApiHash(e.target.value)}
          />
        </div>
        <div className={styles.inputWrapper}>
          <h3>Пользователь</h3>
          <Input
            size="large"
            placeholder="Номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replaceAll(' ', ''))}
          />
          <Input
            size="large"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={onSubmitHandler}
          disabled={
            !apiId.length || !apiHash.length || !phone.length || inProgress
          }
          loading={inProgress}
        >
          Войти
        </Button>
      </section>
      <Modal
        centered
        title="Введите код подтверждения"
        open={modalIsOpen}
        footer={null}
        afterClose={() => {
          dispatch(setInProgress(false))
        }}
        onCancel={() => {
          setModalIsOpen(() => false)
        }}
      >
        <div className={styles.inputWrapper} style={{ marginTop: '30px' }}>
          <Input
            size="large"
            placeholder="Код подтверждения"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            style={{ width: '100%' }}
            type="primary"
            onClick={async () => {
              const [connected, { firstName }] = await telegramClient.startClient(
                phone,
                password,
                code
              )
              if (connected) {
                dispatch(setUserName(firstName))
                navigate('/prepare')
              } else {
                setModalIsOpen(() => false)
                dispatch(setInProgress(false))
              }
            }}
            disabled={!code.length}
          >
            Отправить
          </Button>
        </div>
      </Modal>
    </>
  )
}

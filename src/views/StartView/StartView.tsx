/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Input, Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import styles from './StartView.module.scss'

import { useLocalStorage } from 'hooks'
import { telegramClient } from 'api'
import { type IAppDispatch, setInProgress, setUserName } from 'store'

export function StartView (): JSX.Element {
  const dispatch = useDispatch<IAppDispatch>()
  const [apiId, setApiId] = useLocalStorage('apiId', '')
  const [apiHash, setApiHash] = useLocalStorage('apiHash', '')
  const [phone, setPhone] = useLocalStorage('phone', '')
  const [password, setPassword] = useLocalStorage('password', '')
  const [code, setCode] = useState<string>('')
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const inProgress = useSelector(({ app }: { app: any }) => app.inProgress)
  const onSubmitHandler = async (): Promise<void> => {
    dispatch(setInProgress(true))
    await telegramClient.createClient(apiId, apiHash)
    await telegramClient.sendCode(phone)
    setModalIsOpen(() => true)
  }

  const onClientStartHandler = async (): Promise<void> => {
    const [connected, { firstName }] = await telegramClient.startClient(
      { phoneNumber: phone, password, phoneCode: code })
    if (connected) {
      dispatch(setUserName(firstName))
      dispatch(setInProgress(false))
      navigate('/prepare')
    } else {
      setModalIsOpen((): boolean => false)
      dispatch(setInProgress(false))
    }
  }

  useEffect(() => {
    (async (): Promise<void> => {
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
            onChange={(e: React.BaseSyntheticEvent): void => { setApiId(e.target.value) }}
          />
          <Input
            size="large"
            placeholder="App hash"
            value={apiHash}
            onChange={(e: React.BaseSyntheticEvent): void => { setApiHash(e.target.value) }}
          />
        </div>
        <div className={styles.inputWrapper}>
          <h3>Пользователь</h3>
          <Input
            size="large"
            placeholder="Номер телефона"
            value={phone}
            onChange={(e: React.BaseSyntheticEvent): void => { setPhone(e.target.value.replaceAll(' ', '')) }}
          />
          <Input
            size="large"
            placeholder="Пароль"
            value={password}
            onChange={(e: React.BaseSyntheticEvent): void => { setPassword(e.target.value) }}
          />
        </div>
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={onSubmitHandler}
          disabled={
            apiId.length === 0 || apiHash.length === 0 || phone.length === 0 || inProgress
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
        afterClose={(): void => {
          dispatch(setInProgress(false))
        }}
        onCancel={(): void => {
          setModalIsOpen((): boolean => false)
        }}
      >
        <div className={styles.inputWrapper} style={{ marginTop: '30px' }}>
          <Input
            size="large"
            placeholder="Код подтверждения"
            value={code}
            onChange={(e: React.BaseSyntheticEvent): void => { setCode(e.target.value) }}
          />
          <Button
            style={{ width: '100%' }}
            type="primary"
            onClick={onClientStartHandler}
            disabled={code.length === 0}
          >
            Отправить
          </Button>
        </div>
      </Modal>
    </>
  )
}

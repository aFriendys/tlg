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
import { setUser } from '../../store/appSlice'
import { useDispatch } from 'react-redux'

export function StartView (): JSX.Element {
  const dispatch = useDispatch()
  const [apiId, setApiId] = useLocalStorage('apiId', '')
  const [apiHash, setApiHash] = useLocalStorage('apiHash', '')
  const [phone, setPhone] = useLocalStorage('phone', '')
  const [password, setPassword] = useLocalStorage('password', '')
  const [code, setCode] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const navigate = useNavigate()
  const onSubmitHandler = async (e: React.SyntheticEvent): Promise<any> => {
    await telegramClient.createClient(apiId, apiHash)
    await telegramClient.sendCode(phone)
    setModalIsOpen(() => true)
  }

  useEffect(() => {
    (
      async () => {
        const [connected, { firstName }] = await telegramClient.tryToStartClient()
        if (connected) {
          dispatch(setUser({ name: firstName }))
          navigate('/prepare')
        }
      }
    )()
  }, [])

  return (
    <>
    <section className={styles.section}>
      <h2>
        Register your app <a href="https://my.telegram.org/apps" target="_blank" rel="noreferrer">here</a> and insert below
      </h2>
      <div className={styles.inputWrapper}>
        <h3>App info</h3>
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
        <h3>User info</h3>
        <Input
          size="large"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          size="large"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        type="primary"
        style={{ width: '100%' }}
        onClick={onSubmitHandler}
      >
        Insert
      </Button>
    </section>
    <Modal
    centered
    title="Insert verification code"
    open={modalIsOpen}
    footer={null}
    onCancel={() => setModalIsOpen(() => false)}
  >
    <div className={styles.inputWrapper} style={{ marginTop: '30px' }}>
    <Input
          size="large"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      <Button style={{ width: '100%' }} type="primary" onClick={async () => {
        const user: any = await telegramClient.startClient(phone, password, code)
        dispatch(setUser({ name: user.firstName }))
        navigate('/prepare')
      }}>
            Insert
          </Button>
      </div>
  </Modal>
  </>
  )
}

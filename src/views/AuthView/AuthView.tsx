import styles from './AuthView.module.scss'
import { useLocalStorage } from '../../hooks'
import { Space, Input, Button, Typography, type InputRef } from 'antd'
import { useRef } from 'react'
import { telegramClient } from '../../api'
import { useNavigate } from 'react-router-dom'
const { Text } = Typography

export function AuthView (): JSX.Element {
  const [phone, setPhone] = useLocalStorage('phone', '')
  const [password, setPassword] = useLocalStorage('password', '')

  const navigate = useNavigate()

  const phoneInputRef = useRef<InputRef>(null)
  const phoneButtonRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<InputRef>(null)
  const passwordButtonRef = useRef<HTMLInputElement>(null)
  const codeInputRef = useRef<InputRef>(null)
  const codeButtonRef = useRef<HTMLInputElement>(null)

  async function codeCallback (): Promise<string> {
    if (
      codeButtonRef.current !== null
    ) {
      codeButtonRef.current.disabled = false
    }

    return await new Promise((resolve) => {
      if (codeButtonRef.current !== null) {
        codeButtonRef.current.addEventListener('click', function () {
          if (
            codeInputRef.current !== null &&
            codeInputRef?.current?.input !== null
          ) {
            navigate('/prepare')
            resolve(codeInputRef.current.input.value)
          }
        })
      }
    })
  }

  return (
    <section className={styles.section}>
      <h2>Insert authentication details</h2>
      <div className={styles.inputWrapper}>
        <Space.Compact>
          <Input
            placeholder="Phone number"
            size="large"
            autoComplete="new-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            ref={phoneInputRef}
          />
          <Button
            type="primary"
            ref={phoneButtonRef}
            disabled
          >
            Insert
          </Button>
        </Space.Compact>
        <div className={styles.inputWrapperPassword}>
          <Space.Compact>
            <Input.Password
              placeholder="Password"
              size="large"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordInputRef}

            />
            <Button type="primary" ref={passwordButtonRef}
            onClick={() => {
              telegramClient.startClient(phone, password, codeCallback)
            }}
              >
              Insert
            </Button>
          </Space.Compact>
          <Text type='warning'>*Required via 2fa</Text>
        </div>
        <Space.Compact>
          <Input placeholder="Code" size="large" ref={codeInputRef}/>
          <Button type="primary" ref={codeButtonRef} disabled>
            Insert
          </Button>
        </Space.Compact>
      </div>
    </section>
  )
}

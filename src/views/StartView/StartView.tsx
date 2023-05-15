import { Input, Button } from 'antd'
import { useLocalStorage } from '../../hooks'
import { telegramClient } from '../../api'

import styles from './StartView.module.scss'
import { useNavigate } from 'react-router-dom'

export function StartView (): JSX.Element {
  const [apiId, setApiId] = useLocalStorage('apiId', '')
  const [apiHash, setApiHash] = useLocalStorage('apiHash', '')
  const navigate = useNavigate()
  const onSubmitHandler = (e: React.SyntheticEvent): void => {
    telegramClient.createClient(apiId, apiHash)
    navigate('/auth')
  }

  return (
    <section className={styles.section}>
        <h2>Register your app <a href="https://my.telegram.org/apps" target='_blank' rel="noreferrer">here</a> and insert below</h2>
        <div className={styles.inputWrapper}>
        <Input size="large" placeholder="App id" value={apiId} onChange={(e) => setApiId(e.target.value)}/>
        <Input size="large" placeholder="App hash" value={apiHash} onChange={(e) => setApiHash(e.target.value)}/>
        <Button type='primary' onClick={onSubmitHandler}>Continue</Button>
        </div>
    </section>
  )
}

import { Button } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type IUser } from 'types'
import styles from './Header.module.scss'

export function Header (): JSX.Element {
  const navigate = useNavigate()
  const name = useSelector(({ user }: { user: IUser }): string => user.name)
  const onLogoutHandler = (): void => {
    localStorage.removeItem('session')
    navigate('/')
  }

  return (
        <header className={styles.header} key='header'>
          <span>Привет, {name}!</span>
            <Button onClick={onLogoutHandler}>Выйти</Button>
        </header>
  )
}

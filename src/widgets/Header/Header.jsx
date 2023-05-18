import { Button } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.scss'

export function Header () {
  const navigate = useNavigate()
  const { name } = useSelector(state => state.appSlice.user)
  function onLogoutHandler () {
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

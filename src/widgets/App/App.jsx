/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react'
import styles from './App.module.scss'
import { useLocalStorage } from './hooks'
import { TelegramApi } from '../../api'
import { arrow } from './assets/icons'
import { DynamicTextarea } from './components/DynamicTextarea'

const client = new TelegramApi()

export function App () {
  const [progress, setProgress] = useState(0)
  // const [apiId, setApiId] = useLocalStorage('apiId', '')
  // const [apiHash, setApiHash] = useLocalStorage('apiHash', '')
  const [phone, setPhone] = useLocalStorage('phone', '')
  const submitPhoneButton = useRef()
  const submitCodeButton = useRef()
  const coderef = useRef()

  const [sendQuery, setSendQuery] = useState({ message: '', query: '' })

  const [usersInProgress, setUsersInProgress] = useState([])
  const [usersDone, setUsersDone] = useState([])
  const [currentUser, setCurrentUser] = useState()

  async function createUsersQuery (query) {
    const newQuery = []

    const channels = query.split(' ').filter(query => query.endsWith(':channel')).map(query => query.replace(':channel', ''))
    newQuery.push(...query.split(' ').filter(query => !query.endsWith(':channel')))
    for (const channel of channels) {
      newQuery.push(...await client.getChannelParticipants(channel))
    }

    setUsersInProgress(() => newQuery)
  }

  async function sendMessage (user) {
    setUsersInProgress((users) => {
      const newUsers = [...users]
      newUsers.shift()
      return newUsers
    }
    )

    setCurrentUser(() => user)

    await client.sendMessage(user, sendQuery.message)
    setUsersDone(users => {
      const newUsers = [...users]
      newUsers.push(user)
      return newUsers
    })
  }

  async function sendMessages () {
    setUsersInProgress(() => [])
    for (const user of usersInProgress) {
      await sendMessage(user)
    }
  }

  // function phoneCallback () {
  //   return new Promise((resolve) => {
  //     submitPhoneButton.current.addEventListener('click', function () {
  //       submitPhoneButton.current.disabled = true
  //       resolve(phone)
  //     })
  //   })
  // }

  // function codeCallback () {
  //   submitPhoneButton.current.disabled = true
  //   coderef.current.disabled = false
  //   submitCodeButton.current.disabled = false
  //   return new Promise((resolve) => {
  //     submitCodeButton.current.addEventListener('click', function () {
  //       setProgress((progress) => progress + 1)
  //       resolve(coderef.current.value)
  //     })
  //   })
  // }

  // const onSubmitHandler = (e) => {
  //   e.preventDefault()
  //   client.createClient(apiId, apiHash)
  //   client.startClient(phoneCallback, codeCallback)
  //   setProgress((progress) => progress + 1)
  // }

  const formElements = [
    // <section className={`${styles.section} ${styles.sectionSmall}`} key='1'>
    //   <h2>
    //     Register your app <a href="https://my.telegram.org/apps" target='_blank' rel="noreferrer">here</a> and
    //     insert below:
    //   </h2>
    //   <form className={styles.form} onSubmit={onSubmitHandler}>
    //     <div className={styles.input}>
    //       <label htmlFor="apiId">API ID</label>
    //       <input
    //         type="text"
    //         required
    //         id="apiId"
    //         onChange={(e) => setApiId(e.target.value)}
    //         value={apiId}
    //       />
    //     </div>
    //     <div className={styles.input}>
    //       <label htmlFor="apiHash">API HASH</label>
    //       <input
    //         type="text"
    //         required
    //         id="apiHash"
    //         onChange={(e) => setApiHash(e.target.value)}
    //         value={apiHash}
    //       />
    //     </div>
    //     <input type="submit" value="Insert" />
    //   </form>
    // </section>,
    // <section className={`${styles.section} ${styles.sectionSmall}`} key='2'>
    //   <h2>Insert phone number and code bellow:</h2>
    //   <form className={styles.form}>
    //     <div className={styles.input}>
    //       <label htmlFor="phone">PHONE NUMBER</label>
    //       <input
    //         type="text"
    //         required
    //         id="phone"
    //         onChange={(e) => setPhone(e.target.value)}
    //         value={phone}
    //       />
    //     </div>
    //     <input
    //       type="submit"
    //       value="Insert"
    //       ref={submitPhoneButton}
    //       onClick={(e) => e.preventDefault()}
    //     />
    //     <div className={styles.input}>
    //       <label htmlFor="code">CODE</label>
    //       <input type="text" required id="code" disabled ref={coderef} minLength='5'/>
    //     </div>
    //     <input
    //       type="submit"
    //       value="Insert"
    //       ref={submitCodeButton}
    //       disabled
    //       onClick={(e) => e.preventDefault()}
    //     />
    //   </form>
    // </section>,
    // <section className={`${styles.section} ${styles.sectionMedium}`} key='3'>
    //   <h2>Finally, fill remaining fields:</h2>
    //   <form className={styles.form}>
    //     <div className={styles.input}>
    //       <label htmlFor="message">MESSAGE</label>
    //       <textarea
    //         id="message"
    //         rows="10"
    //         name="message"
    //         value={sendQuery.message}
    //         onChange={(e) => {
    //           setSendQuery((query) => ({
    //             ...query,
    //             [e.target.name]: e.target.value
    //           }))
    //         }}
    //       ></textarea>
    //     </div>
    //     <div className={styles.input}>
    //       <label htmlFor="users">USERS</label>
    //       <textarea
    //         id="users"
    //         rows="10"
    //         value={sendQuery.name}
    //         name="query"
    //         onChange={(e) => {
    //           setSendQuery((query) => ({
    //             ...query,
    //             [e.target.name]: e.target.value
    //           }))
    //         }}
    //       ></textarea>
    //     </div>
    //     <input
    //       type="submit"
    //       value="Continue"
    //       onClick={async (e) => {
    //         e.preventDefault()
    //         await createUsersQuery(sendQuery.query)
    //         setProgress((progress) => progress + 1)
    //       }}
    //     />
    //   </form>
    // </section>,
    <section className={`${styles.section} ${styles.sectionLarge}`} key='4'>
      <h2>Sending messages:</h2>
      <span>
        {currentUser
          ? `Sending message to ${currentUser}`
          : 'All users receive their messages'}
      </span>
      <form className={`${styles.form} ${styles.formInline}`}>
        <div className={styles.input}>
          <label>IN PROGRESS</label>
          <DynamicTextarea users={usersInProgress} key="asd"></DynamicTextarea>
        </div>
        <img src={arrow} alt="arrow" className={styles.arrow} />
        <div className={styles.input}>
          <label>DONE</label>
          <DynamicTextarea
            users={usersDone}
            key="sfa"
            doneTextarea
          ></DynamicTextarea>
        </div>
        <input
          type="submit"
          value="Send messages"
          // disabled={usersInProgress.length}
          onClick={async (e) => {
            e.preventDefault()
            sendMessages()
          }}
        />
      </form>
    </section>
  ]

  return <main className={styles.main}>{formElements[progress]}</main>
}

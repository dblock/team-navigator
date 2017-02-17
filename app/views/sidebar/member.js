import veact from 'veact'
import { assign, find } from 'lodash'
import url from 'url'
import moment from 'moment'

import { state, filterMembersByTeam } from '../../controllers'
import { type, borderedButton } from '../lib'

import email from './email.svg'
import calendar from './calendar.svg'
// import chat from "./chat.svg"

const view = veact()
const headshotSize = 100

const { div, h2, h3, nav, a, p, hr } = view.els()

view.styles({
  h2: assign(
    type('garamond', 'body'),
    {
      marginBottom: 0,
      fontWeight: 'bold'
    }
  ),
  h3: assign(
    type('garamond', 'body'),
    {
      marginTop: 10,
      fontWeight: 'bold'
    }
  ),
  backButton: assign(
    type('avantgarde', 'body'),
    borderedButton(),
    {
      marginTop: 0
    }
  ),
  teamButton: assign(
    type('avantgarde', 'body'),
    borderedButton(),
    {
      cursor: 'pointer',
      marginTop: 20
    }
  ),
  location: {
    marginTop: 4,
    color: '#777'
  },
  nav: {
    marginTop: 20,
    marginBottom: 20
  },
  navItem: {
    marginRight: 10
  },
  wrapper: {
    display: "block",
    paddingBottom: "10px"
  },
  headshotLink: {
    display: 'block',
    height: headshotSize,
    width: headshotSize,
    float: 'right'
  },
  headshot: {
    borderRadius: headshotSize,
    height: headshotSize,
    width: headshotSize,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    display: 'inline-block',
    verticalAlign: 'top'
  },
  role: {
    marginTop: 20,
    lineHeight: 1.4
  }
})

view.render(() => {
  const member = state.get('member')
  const src = url.parse(member.headshot).pathname
  const noDLhref = member.headshot.replace('?dl=1', '')
  const floorOrNothing = member.floor ? `, Fl. ${member.floor}` : ''
  const reportees = state.get('allMembers').filter(reportee => reportee.reportsTo === member.name)

  return div(
      a('.backButton', { href: '/' }, 'Back'),
      a('.headshotLink', {href: noDLhref},
        div('.headshot', { style: { backgroundImage: `url(/img${src})` } }),
      ),
      h2('.h2', member.name),
      p(member.title),
      p('.location', `${member.city}${floorOrNothing}`),
      member.startDate ? p('.location', `Joined: ${moment(member.startDate).fromNow()}`) : '',
      nav('.nav', [
        a('.navItem', { href: `${member.email}artsymail.com`, dangerouslySetInnerHTML: { __html: email } }),
        a('.navItem', { href: `https://calendar.google.com/calendar/embed?src=${member.email}artsymail.com&ctz=America/New_York`, dangerouslySetInnerHTML: { __html: calendar } })
      ]),
      member.roleText ? hr() : '',
      p('.role', member.roleText),
      h3('.h3', 'Teams'),
      a({ href: `/team/${member.teamID}`, style: { display: "block" }}, member.team),
      a({ href: `/team/${member.productTeamID}`, style: { display: "block" }}, member.productTeam),
      div(reportees.length ?
      div(
        h3('.h3', 'Reportees'),
          reportees.map(reportee => 
            a('.wrapper', { href: `/member/${reportee.handle}`, style: { display: "block" }}, reportee.name)
          ))
      : ''
      ),
      div(member.reportsTo
        ? div(
            h3('.h3', 'Reports to'),
            a('.wrapper', { href: `/member/${find(state.get('allMembers'), { 'name': member.reportsTo }).handle}`}, state.get('member').reportsTo)
          )
        : ''
      )
    )
}
)

export default view()

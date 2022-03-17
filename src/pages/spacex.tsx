import { gql } from '@apollo/client'
import client from 'apollo'
import { FC } from 'react'

const listLaunches = gql`
  query ($limit: Int!) {
    launchesPast(limit: $limit) {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
        first_stage {
          cores {
            flight
            core {
              reuse_count
              status
            }
          }
        }
        second_stage {
          payloads {
            payload_type
            payload_mass_kg
            payload_mass_lbs
          }
        }
      }
      ships {
        name
        home_port
        image
      }
    }
  }
`
type Props = {}

const Spacex: FC<Props> = ({ data }) => {
  console.log(data)
  /*reate a dedupe function which takes an array of Object instances and returns a new array with no items that have the same item.id value, but if there's any duplicate items the data for them should be merged into a single object. All of this keeping the original array's order as closely as possible (see the test case for an example of the expected output).

You can check the test file (with a couple of example cases) in the filesystem tab to your left. */
  const data = [
    {
      id: 2,
      name: 'John Doe',
    },
    {
      id: 1,
      name: 'Jane Doe',
    },
    {
      id: 3,
      name: 'Samuel Soe',
      phone: '+12223334444',
    },
    {
      id: 2,
      name: 'John Doe',
    },
    {
      id: 4,
      name: 'John Doe',
    },
  ]
  function dedupe(list) {
    const result = list.reduce((acc, curr) => {
      const existing = acc.find((item) => item.id === curr.id)
      if (existing) {
        existing.name = `${existing.name} & ${curr.name}`
      } else {
        acc.push(curr)
      }
      return acc
    }, [])
    return result
  }
  dedupe(data)

  return (
    <div>
      <h1>Spacex</h1>
    </div>
  )
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: listLaunches,
    variables: { limit: 50 },
    context: {
      clientName: 'spacex',
    },
  })
  return {
    props: {
      data,
    },
  }
}

export default Spacex

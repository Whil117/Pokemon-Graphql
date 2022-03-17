import { gql, useQuery } from '@apollo/client'
import client from 'apollo'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'
const pokemonqgl = gql`
  query pokemons($first: Int!) {
    pokemons(first: $first) {
      id
      number
      name
      weight {
        minimum
        maximum
      }
      height {
        minimum
        maximum
      }
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      image
    }
  }
`
type Props = {
  data: {
    pokemons: Array<{
      id: string
      number: string
      name: string
      image: string
      weight: {
        minimum: number
        maximum: number
      }
      height: {
        minimum: number
        maximum: number
      }
    }>
  }
}

const Home: NextPage<Props> = ({ data: { pokemons } }) => {
  const [pokemon, setPokemon] = useState(pokemons)
  const [load, setLoad] = useState(false)
  const { data, refetch } = useQuery(pokemonqgl, {
    variables: { first: pokemon.length + 5 },
  })
  const [search, setSearch] = useState('')

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return
    setLoad(true)
    // eslint-disable-next-line no-console
    console.log('Fetch more list items!')
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (load) {
      refetch()
      if (data?.pokemons) {
        setPokemon([...data?.pokemons])
      }
      setLoad(false)
    }
  }, [load])

  return (
    <div>
      <h1>Pokemon GraphQL </h1>
      <input
        type="text"
        className="Search"
        placeholder="Search a pokemon"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setSearch(event.target.value)
        }
      />
      <div className="Cards">
        {pokemon
          ?.filter((pokemon) =>
            pokemon.name
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase())
          )
          .map((pokemon) => (
            <Link
              key={pokemon.id}
              passHref
              href={{
                pathname: '/pokemon/[id]',
                query: { id: pokemon.id },
              }}
            >
              <a key={pokemon.id} className="Card">
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                />
                <h4>{pokemon.name}</h4>
              </a>
            </Link>
          ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: pokemonqgl,
    variables: { first: 50 },
  })
  return {
    props: {
      data,
    },
  }
}
export default Home

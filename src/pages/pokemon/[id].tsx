import { gql } from '@apollo/client'
import client from 'apollo'
import { NextPageContext } from 'next'
import Image from 'next/image'
import { FC } from 'react'

type Props = {
  data: {
    pokemon: {
      id: string
      image: string
      number: string
      name: string
      weight: {
        minimum: number
        maximum: number
      }
      height: {
        minimum: number
        maximum: number
      }
      classification: string
      types: Array<string>
    }
  }
}

const soloPokemon = gql`
  query pokemon($id: String, $name: String) {
    pokemon(id: $id, name: $name) {
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

const Pokemon: FC<Props> = ({ data }) => {
  return (
    <div>
      <h1>Pokemon</h1>
      <Image
        src={data.pokemon.image}
        width={300}
        height={300}
        alt={data.pokemon.name}
      />
      <h1>{data.pokemon.name}</h1>
      <p>Classification: {data.pokemon.classification}</p>
    </div>
  )
}
export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query
  const { data } = await client.query({
    query: soloPokemon,
    variables: { id: id },
  })
  return {
    props: {
      data,
    },
  }
}

export default Pokemon

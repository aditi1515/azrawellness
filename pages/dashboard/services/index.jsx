import { collection, getDocs, query } from 'firebase/firestore'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { db } from '../../../firebase-config'
import { SERVICES } from '../../../utils/constants'
import Image from 'next/image'
import { Splash } from '../../../components'

const Services = () => {
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])

  const columns = [
    {
      name: 'Title',
      selector: (row) => (
        <Link href={`/dashboard/posts/${row.id}`}>{row.title}</Link>
      ),
      grow: 1,
    },
    {
      name: 'Image',
      selector: (row) =>
        row.thumbnail.url ? (
          <Image
            width={40}
            height={40}
            objectFit="cover"
            src={row.thumbnail.url}
            alt={row.title}
          />
        ) : (
          ''
        ),
    },
    {
      name: 'Actions',
      right: true,
      cell: (row) => (
        <div className="space-x-2">
          <Link href={`/dashboard/services/${row.id}`}>
            <a className="bg-green text-white px-4 py-2 rounded">Edit</a>
          </Link>
          <button
            onClick={deleteService(row.id)}
            className="bg-red text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  const getServices = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, SERVICES))
      const querySnapshot = await getDocs(q)

      const services = []
      querySnapshot.forEach((doc) => {
        console.log(doc)
        services.push({
          ...doc.data(),
          id: doc.id,
        })
      })
      setLoading(false)
      setServices(services)
    } catch (error) {
      setLoading(false)
    }
  }

  const deleteService = (id) => {
    // TODO: Add Logic
  }

  useEffect(() => {
    getServices()
  }, [])
  if (loading) return <Splash />

  if (services)
    return (
      <div className="my-10">
        <div className="items-center flex justify-between mb-4">
          <div className="text-2xl">Services</div>
          <Link href="/dashboard/services/new">
            <a className="bg-primary text-white px-8 py-2 rounded hover:shadow transition">
              New
            </a>
          </Link>
        </div>
        <div className="bg-white rounded shadow w-full">
          <DataTable
            columns={columns}
            pagination
            data={services}
            progressPending={loading}
          />
        </div>
      </div>
    )
}

export default Services

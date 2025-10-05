import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [filterJobs, setFilterJobs] = useState(jobs)

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const handleLocationChange = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    )
  }

  useEffect(() => {
    const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
    const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)
    const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
    const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

    const newFilterJobs = jobs.slice().reverse().filter(
      job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
    )

    setFilterJobs(newFilterJobs)
    setCurrentPage(1)
  }, [jobs, selectedCategories, selectedLocations, searchFilter])

  const totalPages = Math.ceil(filterJobs.length / 6)

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row gap-8 py-8'>
      {/* Sidebar */}
      <aside className='w-full lg:w-1/4 bg-white px-4 lg:sticky lg:top-20'>
        {/* Current Search */}
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <div className='mb-4'>
            <h3 className='font-medium text-lg mb-2'>Current Search</h3>
            <div className='flex flex-wrap gap-2 text-gray-600'>
              {searchFilter.title && (
                <span className='inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded'>
                  {searchFilter.title}
                  <img
                    onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
                    className='cursor-pointer'
                    src={assets.cross_icon}
                    alt="Remove"
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className='inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded'>
                  {searchFilter.location}
                  <img
                    onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
                    className='cursor-pointer'
                    src={assets.cross_icon}
                    alt="Remove"
                  />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Toggle Filters on Mobile */}
        <button
          onClick={() => setShowFilter(prev => !prev)}
          className='px-6 py-2 rounded border border-gray-400 lg:hidden mb-4'
        >
          {showFilter ? "Close Filters" : "Show Filters"}
        </button>

        {/* Category Filter */}
        <div className={showFilter || 'lg:block'}>
          <h4 className='font-medium text-lg py-2'>Categories</h4>
          <ul className='space-y-2 text-gray-600'>
            {JobCategories.map((category, index) => (
              <li className='flex items-center gap-2' key={index}>
                <input
                  type="checkbox"
                  className='scale-125'
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter */}
        <div className={showFilter || 'lg:block mt-6'}>
          <h4 className='font-medium text-lg py-2'>Locations</h4>
          <ul className='space-y-2 text-gray-600'>
            {JobLocations.map((location, index) => (
              <li className='flex items-center gap-2' key={index}>
                <input
                  type="checkbox"
                  className='scale-125'
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Job Listing */}
      <main className='w-full lg:w-3/4 text-gray-800'>
        <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
        <p className='mb-8'>Get your desired job from top companies</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
          {filterJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-center gap-2 mt-10'>
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className='p-2 rounded border border-gray-300 hover:bg-gray-100'
            >
              <img src={assets.left_arrow_icon} alt="Prev" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 flex items-center justify-center border rounded ${
                  currentPage === index + 1
                    ? 'bg-blue-100 text-blue-500 border-blue-300'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='p-2 rounded border border-gray-300 hover:bg-gray-100'
            >
              <img src={assets.right_arrow_icon} alt="Next" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default JobListing

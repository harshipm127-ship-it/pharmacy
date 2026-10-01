// import React, { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { inventoryApi } from '../services/adminService'
// import '../styles/admin.css'

// function InventoryManagement() {
//   const navigate = useNavigate()
//   const [inventory, setInventory] = useState([])
//   const [warehouses, setWarehouses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [stockFilter, setStockFilter] = useState('')
//   const [warehouseFilter, setWarehouseFilter] = useState('')
//   const [expiryFilter, setExpiryFilter] = useState('')
//   const [sortBy, setSortBy] = useState('newest')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [page, setPage] = useState(1)
//   const pageSize = 8

//   const loadData = async () => {
//     setLoading(true)
//     try {
//       const [inventoryResponse, warehouseResponse] = await Promise.all([
//         inventoryApi.list({ search, stock_status: stockFilter || undefined, warehouse_id: warehouseFilter || undefined, expiry_filter: expiryFilter || undefined, sort_by: sortBy }),
//         inventoryApi.warehouses(),
//       ])
//       setInventory(inventoryResponse.data || [])
//       setWarehouses(warehouseResponse.data || [])
//     } catch {
//       setInventory([])
//       setWarehouses([])
//       setError('Unable to load inventory data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadData()
//   }, [search, stockFilter, warehouseFilter, expiryFilter, sortBy])

//   const filteredInventory = useMemo(() => {
//     return inventory.filter((item) => {
//       const query = search.toLowerCase()
//       const matchesSearch = !query || `${item.product?.name || ''} ${item.product?.sku || ''}`.toLowerCase().includes(query)
//       return matchesSearch
//     })
//   }, [inventory, search])

//   const pagedInventory = useMemo(() => {
//     const start = (page - 1) * pageSize
//     return filteredInventory.slice(start, start + pageSize)
//   }, [filteredInventory, page])

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'low_stock': return 'status-badge low-stock'
//       case 'out_of_stock': return 'status-badge out-of-stock'
//       case 'expired': return 'status-badge expired'
//       default: return 'status-badge in-stock'
//     }
//   }

//   const openAdjustment = (item) => {
//     navigate(`/admin/inventory-management/adjust/${item.id}`)
//   }

//   const openTransfer = (item) => {
//     navigate(`/admin/inventory-management/transfer/${item.id}`)
//   }

//   const openHistory = (item) => {
//     navigate(`/admin/inventory-management/history/${item.id}`)
//   }

//   const exportCsv = () => {
//     const header = ['Product Name', 'SKU', 'Warehouse', 'Batch Number', 'Current Stock', 'Reserved Stock', 'Available Stock', 'Minimum Stock', 'Maximum Stock', 'Expiry', 'Status']
//     const rows = filteredInventory.map((item) => [item.product?.name || '', item.product?.sku || '', item.warehouse?.name || '', item.batch_number || '', item.current_stock, item.reserved_stock, item.available_stock, item.minimum_stock, item.maximum_stock, item.expiry_date || '', item.stock_status])
//     const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement('a')
//     link.href = url
//     link.download = 'inventory.csv'
//     link.click()
//     URL.revokeObjectURL(url)
//   }

//   const restockItem = async (item) => {
//     const needed = Math.max(1, (item.minimum_stock || 0) - item.available_stock + 1)
//     try {
//       await inventoryApi.updateStock(item.id, {
//         change_quantity: needed,
//         reason: 'restock',
//         notes: 'Low stock alert restock',
//         updated_by: 'admin',
//       })
//       setSuccess('Restock recorded')
//       loadData()
//     } catch {
//       setError('Unable to record restock')
//     }
//   }

//   return (
//     <div className='admin-module-page'>
//       <div className='admin-welcome'>
//         <div>
//           <h1>Inventory Management</h1>
//           <p>Monitor stock levels, expiry dates, warehouse inventory, and product availability.</p>
//         </div>
//       </div>

//       <div className='toolbar-card'>
//         <div className='toolbar-controls'>
//           <label className='field-group'><span>Search Product</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search by product or SKU' /></label>
//           <label className='field-group'><span>Filter by Stock Status</span><select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}><option value=''>All</option><option value='in_stock'>In Stock</option><option value='low_stock'>Low Stock</option><option value='out_of_stock'>Out of Stock</option><option value='expired'>Expired</option></select></label>
//           <label className='field-group'><span>Filter by Warehouse</span><select value={warehouseFilter} onChange={(event) => setWarehouseFilter(event.target.value)}><option value=''>All</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}</select></label>
//           <label className='field-group'><span>Filter by Expiry</span><select value={expiryFilter} onChange={(event) => setExpiryFilter(event.target.value)}><option value=''>All</option><option value='expired'>Expired</option><option value='within_30'>Within 30 Days</option><option value='within_60'>Within 60 Days</option><option value='within_90'>Within 90 Days</option></select></label>
//           <label className='field-group'><span>Sort By</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value='newest'>Newest</option><option value='name'>Name</option><option value='expiry'>Expiry</option></select></label>
//         </div>
//         <div className='action-buttons'>
//           <button className='primary-button' onClick={exportCsv}>Export Inventory</button>
//           <button className='ghost-button' onClick={() => navigate('/admin/inventory-management/add-warehouse')}>Add Warehouse</button>
//         </div>
//       </div>

//       {error ? <div className='admin-error-box'>{error}</div> : null}
//       {success ? <div className='admin-success-box'>{success}</div> : null}

//       <div className='table-card'>
//         {loading ? <p>Loading inventory...</p> : filteredInventory.length === 0 ? <p>No inventory records found.</p> : (
//           <div className='table-wrapper'>
//             <table className='data-table'>
//               <thead>
//                 <tr>
//                   <th>Image</th><th>Product</th><th>SKU</th><th>Warehouse</th><th>Batch</th><th>Current Stock</th><th>Reserved Stock</th><th>Available Stock</th><th>Min</th><th>Max</th><th>Expiry</th><th>Status</th><th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pagedInventory.map((item) => (
//                   <tr key={item.id}>
//                     <td>{item.product?.image_url ? <img src={`http://localhost:8000/${item.product.image_url}`} alt={item.product?.name || 'product'} className='banner-thumb' /> : '—'}</td>
//                     <td>{item.product?.name || '—'}</td>
//                     <td>{item.product?.sku || '—'}</td>
//                     <td>{item.warehouse?.name || '—'}</td>
//                     <td>{item.batch_number || '—'}</td>
//                     <td>{item.current_stock}</td>
//                     <td>{item.reserved_stock}</td>
//                     <td>{item.available_stock}</td>
//                     <td>{item.minimum_stock}</td>
//                     <td>{item.maximum_stock}</td>
//                     <td>{item.expiry_date || '—'}</td>
//                     <td><span className={getStatusClass(item.stock_status)}>{item.stock_status.replace('_', ' ')}</span></td>
//                     <td>
//                       <div className='action-buttons'>
//                         <button className='ghost-button' onClick={() => openAdjustment(item)}>Update Stock</button>
//                         <button className='ghost-button' onClick={() => openTransfer(item)}>Transfer</button>
//                         <button className='ghost-button' onClick={() => openHistory(item)}>History</button>
//                         {item.stock_status === 'low_stock' ? <button className='ghost-button' onClick={() => restockItem(item)}>Restock</button> : null}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div className='pagination-row'>
//         <button className='ghost-button' disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
//         <span>Page {page}</span>
//         <button className='ghost-button' disabled={page * pageSize >= filteredInventory.length} onClick={() => setPage((value) => value + 1)}>Next</button>
//       </div>

//     </div>
//   )
// }

// export default InventoryManagement

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { inventoryBatchApi } from '../services/adminService'
import '../styles/admin.css'

function InventoryManagement() {
    const navigate = useNavigate()

    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [error, setError] = useState('')

    const pageSize = 10

    const loadBatches = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await inventoryBatchApi.list({
                page,
                size: pageSize,
                search: search || undefined,
            })

            const pageData = response.data?.data

            setBatches(pageData?.content || [])
            setTotalPages(pageData?.totalPages || 0)
            setTotalElements(pageData?.totalElements || 0)

        } catch (error) {
            console.error('Failed to load inventory batches:', error)

            setBatches([])
            setTotalPages(0)
            setTotalElements(0)
            setError('Unable to load inventory batch data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBatches()
    }, [page, search])

    const handleSearchChange = (event) => {
        setSearch(event.target.value)
        setPage(0)
    }

    const filteredBatches = batches.filter((batch) => {
        if (!activeFilter) {
            return true
        }

        return String(batch.active) === activeFilter
    })

    const openBatchDetails = (batch) => {
        navigate(
            `/admin/inventory-management/batches/${batch.publicId}`
        )
    }

    const openCreateBatch = () => {
        navigate('/admin/inventory-management/batches/create')
    }

    const exportCsv = () => {
        const header = [
            'Product SKU',
            'Product Name',
            'Store',
            'Batch Number',
            'Expiry Date',
            'Available Quantity',
            'Active'
        ]

        const rows = filteredBatches.map((batch) => [
            batch.productSku || '',
            batch.productName || '',
            batch.storeName || '',
            batch.batchNumber || '',
            batch.expiryDate || '',
            batch.availableQuantity ?? '',
            batch.active ? 'Active' : 'Inactive'
        ])

        const csv = [header, ...rows]
            .map((row) =>
                row
                    .map((cell) =>
                        `"${String(cell).replace(/"/g, '""')}"`
                    )
                    .join(',')
            )
            .join('\n')

        const blob = new Blob(
            [csv],
            { type: 'text/csv;charset=utf-8;' }
        )

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = 'inventory-batches.csv'
        link.click()

        URL.revokeObjectURL(url)
    }

    const getStockClass = (quantity) => {
        if (quantity === 0) {
            return 'status-badge out-of-stock'
        }

        return 'status-badge in-stock'
    }

    return (
        <div className='admin-page'>

            <div className='page-header'>
                <h1>Inventory Management</h1>

                <p>
                    Manage product inventory batches, store stock,
                    expiry dates, and available quantities.
                </p>
            </div>

            <div className='toolbar-card'>

                <div className='toolbar-controls'>

                    <label className='field-group'>
                        <span>Search</span>

                        <input
                            value={search}
                            onChange={handleSearchChange}
                            placeholder='Search product, SKU or batch'
                        />
                    </label>

                    <label className='field-group'>
                        <span>Status</span>

                        <select
                            value={activeFilter}
                            onChange={(event) => {
                                setActiveFilter(event.target.value)
                            }}
                        >
                            <option value=''>
                                All
                            </option>

                            <option value='true'>
                                Active
                            </option>

                            <option value='false'>
                                Inactive
                            </option>
                        </select>
                    </label>

                </div>

                <div className='action-buttons'>

                    <button
                        className='ghost-button'
                        onClick={() => navigate('/admin/inventory-management/records')}
                    >
                        Inventory Records
                    </button>

                    <button
                        className='ghost-button'
                        onClick={() => navigate('/admin/inventory-management/inventory/create')}
                    >
                        Create Inventory Record
                    </button>

                    <button
                        className='primary-button'
                        onClick={openCreateBatch}
                    >
                        Add Inventory Batch
                    </button>

                    <button
                        className='ghost-button'
                        onClick={exportCsv}
                        disabled={filteredBatches.length === 0}
                    >
                        Export Inventory
                    </button>

                </div>

            </div>

            {error ? (
                <div className='admin-error-box'>
                    {error}
                </div>
            ) : null}

            <div className='table-card'>

                {loading ? (
                    <p>Loading inventory batches...</p>

                ) : filteredBatches.length === 0 ? (

                    <p>
                        No inventory batches found.
                    </p>

                ) : (

                    <div className='table-wrapper'>

                        <table className='data-table'>

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Store</th>
                                    <th>Batch</th>
                                    <th>Expiry</th>
                                    <th>Available</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredBatches.map((batch) => (

                                    <tr key={batch.publicId}>

                                        <td>
                                            {batch.productName || '—'}
                                        </td>

                                        <td>
                                            {batch.productSku || '—'}
                                        </td>

                                        <td>
                                            {batch.storeName || '—'}
                                        </td>

                                        <td>
                                            {batch.batchNumber || '—'}
                                        </td>

                                        <td>
                                            {batch.expiryDate || '—'}
                                        </td>

                                        <td>
                                            <span
                                                className={getStockClass(
                                                    batch.availableQuantity
                                                )}
                                            >
                                                {batch.availableQuantity ?? 0}
                                            </span>
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    batch.active
                                                        ? 'status-badge in-stock'
                                                        : 'status-badge expired'
                                                }
                                            >
                                                {batch.active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>

                                        </td>

                                        <td>

                                            <div className='action-buttons'>

                                                <button
                                                    className='ghost-button'
                                                    onClick={() =>
                                                        openBatchDetails(batch)
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className='ghost-button'
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/inventory-management/batches/${batch.publicId}/edit`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            <div className='pagination-row'>

                <button
                    className='ghost-button'
                    disabled={page === 0 || loading}
                    onClick={() =>
                        setPage((value) =>
                            Math.max(0, value - 1)
                        )
                    }
                >
                    Previous
                </button>

                <span>
                    Page {totalPages === 0 ? 0 : page + 1}
                    {' '}of{' '}
                    {totalPages}
                    {' '}
                    ({totalElements} records)
                </span>

                <button
                    className='ghost-button'
                    disabled={
                        loading ||
                        totalPages === 0 ||
                        page >= totalPages - 1
                    }
                    onClick={() =>
                        setPage((value) => value + 1)
                    }
                >
                    Next
                </button>

            </div>

        </div>
    )
}

export default InventoryManagement

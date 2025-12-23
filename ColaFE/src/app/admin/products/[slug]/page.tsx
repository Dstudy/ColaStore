import useSWR from "swr"


export default function ProductAdminDetailPage(productId: number) {

    const { data, error } = useSWR(`http://localhost:8800/api/admin/products/${productId}`, fetch);

    return (
        <>
            <h1>Product Admin Detail Page</h1>



        </>
    )
}
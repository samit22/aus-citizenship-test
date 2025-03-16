import Result from '../../../Component/Result'

export default async function Page({params,}: {params: Promise<{ id: string }>}) {
    const id = (await params).id
    return(
        <Result sessionId={id}/>
    )
}



import React from 'react';
import Session from '../../../Component/Session'

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const id = (await params).id
  return(
    <Session sessionId={id}/>
  )
  }

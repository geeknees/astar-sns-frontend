import { ApiPromise } from '@polkadot/api'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import React, { useEffect, useState } from 'react'

import BottomNavigation from '../components/bottomNavigation'
import Post from '../components/post'
import ProfileSettingModal from '../components/profileSettingModal'
import ProfileSubTopBar from '../components/profileSubTopBar'
import TopBar from '../components/topBar'
import { connectToContract } from '../hooks/connect'
import { balenceOf } from '../hooks/FT'
import type { PostType } from '../hooks/postFunction'
import { getIndividualPost } from '../hooks/postFunction'
import {
  checkCreatedInfo,
  createProfile,
  getFollowerList,
  getFollowingList,
  getProfileForProfile
} from '../hooks/profileFunction'

export default function profile(props: any) {
  const [imgUrl, setImgUrl] = useState('')
  const [isCreatedProfile, setIsCreatedProfile] = useState(true)
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false)
  const [name, setName] = useState('')
  const [individualPostList, setIndividualPostList] = useState<PostType[]>([])

  const [showSettingModal, setShowSettingModal] = useState(false)
  const [isSetup, setIsSetup] = useState(false)
  const [api, setApi] = useState<ApiPromise>()
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([])
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>()
  const [followingList, setFollowingList] = useState<Array<string>>([])
  const [followerList, setFollowerList] = useState<Array<string>>([])
  const [balance, setBalance] = useState<string>('0')

  useEffect(() => {
    connectToContract({
      api: api,
      accountList: accountList,
      actingAccount: actingAccount!,
      isSetup: isSetup,
      setApi: setApi,
      setAccountList: setAccountList,
      setActingAccount: setActingAccount!,
      setIsSetup: setIsSetup
    })
  }, [])

  useEffect(() => {
    if (!isSetup) return

    console.log('isSetup')

    getProfileForProfile({
      api: api,
      userId: actingAccount?.address,
      setImgUrl: setImgUrl,
      setName: setName
    })
    console.log('getProfileForProfile')
  }, [actingAccount, isSetup])

  useEffect(() => {
    if (!isSetup) return

    getIndividualPost({
      api: api,
      actingAccount: actingAccount,
      setIndividualPostList: setIndividualPostList
    })
    console.log('getIndividualPost')
  }, [actingAccount, isSetup])

  useEffect(() => {
    if (!isSetup) return

    getFollowingList({
      api: api,
      userId: actingAccount?.address,
      setFollowingList: setFollowingList
    })
    console.log('getFollowingList')
  }, [actingAccount, isSetup])

  useEffect(() => {
    if (!isSetup) return

    getFollowerList({
      api: api,
      userId: actingAccount?.address,
      setFollowerList: setFollowerList
    })
    console.log('getFollowerList')
  }, [actingAccount, isSetup])

  useEffect(() => {
    if (!isSetup) return

    balenceOf({
      api: api,
      actingAccount: actingAccount!,
      setBalance: setBalance
    })
    console.log('balenceOf')

    if (isCreatedFnRun) return
    console.log('isCreatedFnRun')

    checkCreatedInfo({
      api: api,
      userId: actingAccount?.address!,
      setIsCreatedProfile: setIsCreatedProfile
    })
    console.log('checkCreatedInfo')

    if (isCreatedProfile) return
    console.log('isCreatedProfile')

    createProfile({ api: api, actingAccount: actingAccount! })
    console.log('checkCreatedInfo')

    setIsCreatedFnRun(true)
    console.log('setIsCreatedFnRun')
  }, [actingAccount, isSetup])

  return (
    <div className='flex justify-center items-center bg-gray-200 w-screen h-screen relative'>
      <main className='items-center h-screen w-1/3 flex bg-white flex-col'>
        <ProfileSettingModal
          isOpen={showSettingModal}
          afterOpenFn={setShowSettingModal}
          api={api}
          userId={actingAccount?.address}
          setImgUrl={setImgUrl}
          setName={setName}
          actingAccount={actingAccount}
        />
        <TopBar
          idList={accountList}
          imgUrl={imgUrl}
          setActingAccount={setActingAccount}
          balance={balance}
        />
        <ProfileSubTopBar
          imgUrl={imgUrl}
          name={name}
          followingList={followingList}
          followerList={followerList}
          isOpenModal={setShowSettingModal}
          setActingAccount={setActingAccount}
          idList={accountList}
          api={api!}
          actingAccount={actingAccount!}
          setIsCreatedFnRun={setIsCreatedFnRun}
        />
        <div className='flex-1 overflow-scroll'>
          {individualPostList.map((post, i) => (
            <Post
              key={i}
              name={post.name}
              time={post.createdTime}
              description={post.description}
              num_of_likes={post.numOfLikes}
              user_img_url={imgUrl}
              post_img_url={post.imgUrl}
            />
          ))}
        </div>
        <div className='w-full'>
          <BottomNavigation />
        </div>
      </main>
    </div>
  )
}

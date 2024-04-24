import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

const UserPage = () => {
  return (
    <>
     <UserHeader/>
     <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads."/>
     <UserPost likes={324} replies={3645} postImg="/post2.png" postTitle="Let's talk utkarsh about threads."/>
     <UserPost likes={325} replies={434} postImg="/post3.png" postTitle="Let's threads."/>
     <UserPost likes={35} replies={44} postTitle="My first thread"/>
     
    </>
  )
}

export default UserPage

import { Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';

const HomePage = () => {
  const showToast = useShowToast();
  const [posts,setPosts]=useState([])
  const [loading,setLoading]=useState(true)


  useEffect(()=>{
    const getFeedPosts=async()=>{
      setLoading(true)
      try {
        const res=await fetch("/api/posts/feed");
        const data=await res.json()
        if(data.error){
      showToast("Error", data.error, "error")
          
        }
        setPosts(data)
        console.log(data);
      } catch (error) {
      showToast("Error", error, "error")
        
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts();
  },[])
  return (
  <>

   {/* no following users posts or it is not following any user */}
   {!loading && posts.length===0 && <h1>Follow users to see posts</h1>}
  {loading && (
    <Flex justify={"center"}>
      <Spinner size="xl"/>
    </Flex>
  )}

  {posts.map((post)=>(
    <Post key={post._id} post={post} postedBy={post.postedBy}/>
  ))}

 
  </>
  )
}

export default HomePage

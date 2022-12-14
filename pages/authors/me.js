import Link from 'next/link'

export default function FirstPost() {
  return (
    <>
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <h2>
        <Link href="/posts/first-post">
          <a>To posts page</a>
        </Link>
      </h2>
    </>
  )
}
/* eslint-disable react/prop-types */

const AboutSection = ({isSelf,bio,email,date}) => {
  return (
    <div className="w-full my-8">
      {!isSelf?<div className="w-full flex flex-col gap-4">
        {bio && <div className="my-4">
          <h3 className="text-lg font-semibold">Bio</h3>
          <p className="text-md text-gray-700">{bio}</p>
        </div>}
        <div className="my-4">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-md text-gray-700">{email}</p>
        </div>
        <div className="my-4">
          <h3 className="text-lg font-semibold">User since </h3>
          <p className="text-md text-gray-700">{new Date(date).toDateString().split(' ').slice(1).join(' ')}</p>
        </div>
      </div>
      :<div className="w-full flex flex-col gap-4">
        <div className="my-4">
          <h3 className="text-lg font-semibold">Bio</h3>
          {bio?<p className="text-md text-gray-700">{bio}</p>:<p className="text-md text-gray-700">Enter something about yourself in bio.You can update bio using profile page.</p>}
        </div>
        <div className="my-4">
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-md text-gray-700">{email}</p>
        </div>
        <div className="my-4">
          <h3 className="text-lg font-semibold">User since </h3>
          <p className="text-md text-gray-700">{new Date(date).toDateString().split(' ').slice(1).join(' ')}</p>
        </div>
      </div>}
    </div>
  )
}

export default AboutSection
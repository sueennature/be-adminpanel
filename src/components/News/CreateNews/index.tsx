'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react';
interface RoomFormData {
    title: string;
    content: string;
    images: File[];
}

const CreateNews = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    title: '',
    content: '',
    images: []
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files)
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };
  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="Enter the Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
         
          </div>
          
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach Image
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Content
              </label>
              <textarea
                rows={6}
                name="content"
                required
                placeholder="Type Content"
                value={formData.content}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
            </div>
          
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;

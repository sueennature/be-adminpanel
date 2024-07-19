'use client'
import React, { ChangeEvent, FormEvent, useState } from 'react';
interface RoomFormData {
  name: string;
  category: string;
  max_adults: string;
  max_childs: string;
  max_people: string;
  room_only: string;
  bread_breakfast: string;
  half_board: string;
  full_board: string;
  features: string;
  views: string[];
  size: string;
  beds: string;
  bathrooms: string;
  secondary_category: string;
  description: string;
  short_description: string;
  images: File[];
}

const CreateRoom = () => {
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    category: '',
    max_adults: '',
    max_childs: '',
    max_people: '',
    room_only: '',
    bread_breakfast: '',
    half_board: '',
    full_board: '',
    features: '',
    views: [],
    size: '',
    beds: '',
    bathrooms: '',
    secondary_category: '',
    description: '',
    short_description: '',
    images: []
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'views') {
      setFormData({
        ...formData,
        views: value.split(',').map(view => view.trim())
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
    // Perform the form submission logic here
  };
  return (
    <div className="flex flex-col gap-9">
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
          <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Room Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter the Room Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Category
              </label>
              <input
                type="text"
                name="category"
                required
                placeholder="Enter the category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
              <label className="mb-3 block text-sm font-medium text-black">
                Second Category
              </label>
              <input
                type="text"
                name="secondary_category"
                required
                placeholder="Enter the Second Category"
                value={formData.secondary_category}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              />
            </div>
            <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Views
                </label>
                <input
                  type="text"
                  name="views"
                  required
                  placeholder="Enter the Views : hill, garden"
                  value={formData.views.join(', ')}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
          </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
            
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Max Adults
                </label>
                <input
                  type="number"
                  name="max_adults"
                  required
                  placeholder="No of Adults"
                  value={formData.max_adults}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Max Children
                </label>
                <input
                  type="number"
                  name="max_childs"
                  required
                  placeholder="No of Children"
                  value={formData.max_childs}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <label className="mb-3 block text-sm font-medium text-black">
                  Max People
                </label>
                <input
                  type="number"
                  name="max_people"
                  required
                  placeholder="No of People"
                  value={formData.max_people}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Room Only
                </label>
                <input
                  type="number"
                  name="room_only"
                  required
                  placeholder="Enter the price"
                  value={formData.room_only}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Bread and Breakfast
                </label>
                <input
                  type="number"
                  name="bread_breakfast"
                  required
                  placeholder="Enter the price"
                  value={formData.bread_breakfast}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Half Board
                </label>
                <input
                  type="number"
                  name="half_board"
                  required
                  placeholder="Enter the price"
                  value={formData.half_board}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Full Board
                </label>
                <input
                  type="number"
                  name="full_board"
                  required
                  placeholder="Enter the price"
                  value={formData.full_board}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
            </div>
            <div className="mb-6.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Features
                </label>
                <input
                  type="text"
                  name="features"
                  required
                  placeholder="Enter the Features"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  required
                  placeholder="Enter the Size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Beds
                </label>
                <input
                  type="text"
                  name="beds"
                  required
                  placeholder="Enter the beds"
                  value={formData.beds}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
              <div className="w-full xl:w-1/4">
                <label className="mb-3 block text-sm font-medium text-black">
                  Bathrooms
                </label>
                <input
                  type="text"
                  name="bathrooms"
                  required
                  placeholder="Enter the Bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Attach file
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
                Description
              </label>
              <textarea
                rows={6}
                name="description"
                required
                placeholder="Type description"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white"
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-black">
                Short Description
              </label>
              <textarea
                rows={6}
                name="short_description"
                required
                placeholder="Type short description"
                value={formData.short_description}
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

export default CreateRoom;

'use client';

import React from "react"

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

interface KeyFeature {
  app_key_feature_title: string;
  app_key_features_description: string;
}

interface UsefulLink {
  useful_link_label: string;
  useful_link_url: {
    title: string;
    url: string;
  };
}

export default function ContributeForm() {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    app_description: '',
    main_description: '',
    application_status: 'Active',
    app_category: '',
    app_tags: [] as string[],
    maintainer_name: '',
    getting_started: '',
  });

  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([
    { app_key_feature_title: '', app_key_features_description: '' }
  ]);

  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([
    { useful_link_label: '', useful_link_url: { title: '', url: '' } }
  ]);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const appStatuses = ['Active', 'Beta', 'Deprecated'];
  
  const categories = [
    'API',
    'Web App',
    'Mobile App',
    'CLI Tool',
    'Library',
    'Framework',
    'Browser Extension',
    'Other'
  ];

  const availableTags = [
    'Authentication',
    'Payments',
    'Analytics',
    'Notifications',
    'Inventory',
    'Shipping',
    'Customer Support',
    'Marketing',
    'Data Science',
    'Robotics',
    'Cloud Computing',
    'Cybersecurity'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData({
      ...formData,
      app_tags: formData.app_tags.includes(tag)
        ? formData.app_tags.filter(t => t !== tag)
        : [...formData.app_tags, tag]
    });
  };

  const addKeyFeature = () => {
    setKeyFeatures([...keyFeatures, { app_key_feature_title: '', app_key_features_description: '' }]);
  };

  const removeKeyFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  const updateKeyFeature = (index: number, field: keyof KeyFeature, value: string) => {
    const updated = [...keyFeatures];
    updated[index][field] = value;
    setKeyFeatures(updated);
  };

  const addUsefulLink = () => {
    setUsefulLinks([...usefulLinks, { useful_link_label: '', useful_link_url: { title: '', url: '' } }]);
  };

  const removeUsefulLink = (index: number) => {
    setUsefulLinks(usefulLinks.filter((_, i) => i !== index));
  };

  const updateUsefulLink = (index: number, field: 'label' | 'title' | 'url', value: string) => {
    const updated = [...usefulLinks];
    if (field === 'label') {
      updated[index].useful_link_label = value;
    } else {
      updated[index].useful_link_url[field] = value;
    }
    setUsefulLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // Filter out empty key features and links
    const validKeyFeatures = keyFeatures.filter(kf => kf.app_key_feature_title.trim());
    const validLinks = usefulLinks.filter(ul => ul.useful_link_url.url.trim());

    try {
      const response = await fetch('/api/contribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          app_key_features: validKeyFeatures.length > 0 ? validKeyFeatures : undefined,
          app_useful_links: validLinks.length > 0 ? validLinks : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        // Reset form
        setFormData({
          title: '',
          url: '',
          app_description: '',
          main_description: '',
          application_status: 'Active',
          app_category: '',
          app_tags: [],
          maintainer_name: '',
          getting_started: '',
        });
        setKeyFeatures([{ app_key_feature_title: '', app_key_features_description: '' }]);
        setUsefulLinks([{ useful_link_label: '', useful_link_url: { title: '', url: '' } }]);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
          Submit an Application
        </h2>
        <p className="text-gray-600">
          Fill out the form below to contribute to our documentation library
        </p>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-green-900">Success!</h3>
            <p className="text-green-700">{message}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700">{message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-purple-700 border-b border-purple-200 pb-2">Basic Information</h3>
          
          {/* Application Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Application Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="e.g., React, Vue.js, Django"
            />
          </div>

          {/* Official URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-900 mb-2">
              Official Website/Documentation URL <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              id="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="https://example.com"
            />
          </div>

          {/* Application Status */}
          <div>
            <label htmlFor="application_status" className="block text-sm font-semibold text-gray-900 mb-2">
              Application Status <span className="text-red-600">*</span>
            </label>
            <select
              id="application_status"
              name="application_status"
              required
              value={formData.application_status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              {appStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="app_category" className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <select
              id="app_category"
              name="app_category"
              value={formData.app_category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Maintainer Name */}
          <div>
            <label htmlFor="maintainer_name" className="block text-sm font-semibold text-gray-900 mb-2">
              Maintainer/Organization Name
            </label>
            <input
              type="text"
              id="maintainer_name"
              name="maintainer_name"
              value={formData.maintainer_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="e.g., Meta, Google, Individual Developer"
            />
          </div>
        </div>

        {/* Descriptions Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-purple-700 border-b border-purple-200 pb-2">Descriptions</h3>

          {/* Short Description */}
          <div>
            <label htmlFor="app_description" className="block text-sm font-semibold text-gray-900 mb-2">
              Short Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="app_description"
              name="app_description"
              required
              value={formData.app_description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              placeholder="Brief overview (shown in cards)"
            />
          </div>

          {/* Main Description */}
          <div>
            <RichTextEditor
              label="Main Description"
              required
              value={formData.main_description}
              onChange={(content) => setFormData({ ...formData, main_description: content })}
              placeholder="Detailed description of what this application does and why it's useful..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Use the toolbar above to format your content
            </p>
          </div>

          {/* Getting Started */}
          <div>
            <RichTextEditor
              label="Getting Started Guide"
              value={formData.getting_started}
              onChange={(content) => setFormData({ ...formData, getting_started: content })}
              placeholder="Quick start guide or installation instructions..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Not full docs, just pointers to get started. Use the toolbar to format.
            </p>
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <h3 className="text-xl font-bold text-purple-700 border-b border-purple-200 pb-2 mb-4">Tags</h3>
          <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  formData.app_tags.includes(tag)
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-purple-300 hover:border-purple-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Key Features Section */}
        <div>
          <h3 className="text-xl font-bold text-purple-700 border-b border-purple-200 pb-2 mb-4">Key Features</h3>
          {keyFeatures.map((feature, index) => (
            <div key={index} className="mb-4 p-4 border-2 border-purple-200 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Feature {index + 1}</h4>
                {keyFeatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyFeature(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={feature.app_key_feature_title}
                onChange={(e) => updateKeyFeature(index, 'app_key_feature_title', e.target.value)}
                placeholder="Feature title"
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg mb-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <textarea
                value={feature.app_key_features_description}
                onChange={(e) => updateKeyFeature(index, 'app_key_features_description', e.target.value)}
                placeholder="Feature description"
                rows={2}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addKeyFeature}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Feature
          </button>
        </div>

        {/* Useful Links Section */}
        <div>
          <h3 className="text-xl font-bold text-purple-700 border-b border-purple-200 pb-2 mb-4">Useful Links</h3>
          {usefulLinks.map((link, index) => (
            <div key={index} className="mb-4 p-4 border-2 border-purple-200 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Link {index + 1}</h4>
                {usefulLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUsefulLink(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={link.useful_link_label}
                onChange={(e) => updateUsefulLink(index, 'label', e.target.value)}
                placeholder="Link label (e.g., GitHub, Documentation)"
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg mb-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <input
                type="url"
                value={link.useful_link_url.url}
                onChange={(e) => updateUsefulLink(index, 'url', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addUsefulLink}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Link
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

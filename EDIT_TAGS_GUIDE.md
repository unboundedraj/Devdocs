# Adding Edit Tags to Your Components

This guide shows you how to add `data-cslp` attributes (edit tags) to enable inline editing and edit buttons in Contentstack Live Preview.

## What I've Done

✅ Added `includeContentType()` and `includeFallbackLocale()` to all queries in [lib/queries.ts](lib/queries.ts)  
✅ Created `getEditTags()` helper function in [lib/utils.ts](lib/utils.ts)  
✅ Updated [components/homepage/HeroSection.tsx](components/homepage/HeroSection.tsx) as an example

## How to Use Edit Tags

### Step 1: Pass the Entry Object to Your Component

In your page file, pass the full entry object along with the specific fields:

```tsx
// Before
<HeroSection 
  title={homepage.title}
  description={homepage.hero_description}
/>

// After
<HeroSection 
  entry={homepage}  // ← Pass the full entry
  title={homepage.title}
  description={homepage.hero_description}
/>
```

### Step 2: Update Component Props

Add the entry prop and import getEditTags:

```tsx
import { getEditTags } from '@/lib/utils';

interface YourComponentProps {
  entry?: any;  // ← Add this
  title: string;
  description: string;
}

export default function YourComponent({ entry, title, description }: YourComponentProps) {
  // ... component code
}
```

### Step 3: Add Edit Tags to HTML Elements

Use the spread operator to add data-cslp attributes:

```tsx
<h1 {...getEditTags(entry, 'title')}>
  {title}
</h1>

<p {...getEditTags(entry, 'description')}>
  {description}
</p>
```

## Field Path Examples

The second parameter to `getEditTags()` is the field path:

### Simple Fields
```tsx
{...getEditTags(entry, 'title')}
{...getEditTags(entry, 'description')}
{...getEditTags(entry, 'url')}
```

### Nested Fields (using dot notation)
```tsx
{...getEditTags(entry, 'hero.heading')}
{...getEditTags(entry, 'hero.subheading')}
{...getEditTags(entry, 'contribution_cta.cta_heading')}
```

### Array Fields (with index)
```tsx
{...getEditTags(entry, 'value_propositions.0.title')}
{...getEditTags(entry, 'value_propositions.1.description')}
```

## Components to Update

Here are your components that should have edit tags added:

### 1. Homepage Components

#### ValuePropositions ([components/homepage/ValuePropositions.tsx](components/homepage/ValuePropositions.tsx))
```tsx
// Pass the propositions with metadata
<ValuePropositions 
  entry={homepage}
  propositions={homepage.value_propositions}
/>

// In the component, add edit tags:
{propositions.map((prop, index) => (
  <div key={index}>
    <h3 {...getEditTags(entry, `value_propositions.${index}.title`)}>
      {prop.title}
    </h3>
    <p {...getEditTags(entry, `value_propositions.${index}.description`)}>
      {prop.description}
    </p>
  </div>
))}
```

#### ContributionCTA ([components/homepage/ContributionCTA.tsx](components/homepage/ContributionCTA.tsx))
```tsx
// Pass entry
<ContributionCTA
  entry={homepage}
  heading={homepage.contribution_cta?.cta_heading}
  description={homepage.contribution_cta?.cta_description}
  url={homepage.contribution_cta?.cta_url}
/>

// Add tags:
<h2 {...getEditTags(entry, 'contribution_cta.cta_heading')}>
  {heading}
</h2>
<p {...getEditTags(entry, 'contribution_cta.cta_description')}>
  {description}
</p>
```

### 2. Applications Components

#### ApplicationCard ([components/applications/ApplicationCard.tsx](components/applications/ApplicationCard.tsx))
```tsx
// Each card receives an application entry
<div>
  <h3 {...getEditTags(application, 'title')}>
    {application.title}
  </h3>
  <p {...getEditTags(application, 'app_description')}>
    {application.app_description}
  </p>
</div>
```

#### Application Detail Page ([app/applications/[slug]/page.tsx](app/applications/[slug]/page.tsx))
```tsx
<h1 {...getEditTags(application, 'title')}>
  {application.title}
</h1>
<p {...getEditTags(application, 'main_description')}>
  {application.main_description}
</p>
```

### 3. FAQ Components

#### FAQClient ([components/faq/FAQClient.tsx](components/faq/FAQClient.tsx))
```tsx
{faqs.map((faq, index) => (
  <div key={faq.uid || index}>
    <h3 {...getEditTags(faq, 'question')}>
      {faq.question}
    </h3>
    <div {...getEditTags(faq, 'answer')}>
      {faq.answer}
    </div>
  </div>
))}
```

### 4. Support Page

#### Support Channels ([app/support/SupportChannels.tsx](app/support/SupportChannels.tsx))
```tsx
<h1 {...getEditTags(supportPage, 'title')}>
  {supportPage.title}
</h1>
<p {...getEditTags(supportPage, 'description')}>
  {supportPage.description}
</p>
```

### 5. Changelog Components

#### ChangelogList ([components/changelog/ChangelogList.tsx](components/changelog/ChangelogList.tsx))
```tsx
{changelogs.map((changelog) => (
  <div key={changelog.uid}>
    <h3 {...getEditTags(changelog, 'version')}>
      {changelog.version}
    </h3>
    <div {...getEditTags(changelog, 'release_notes')}>
      {changelog.release_notes}
    </div>
  </div>
))}
```

## Important Notes

### 1. Client vs Server Components
- Edit tags work in both client and server components
- The `entry` object must have the metadata ($.\_metadata) which comes from queries with `.includeContentType()`

### 2. When Entry is Undefined
- The `getEditTags()` function safely returns an empty object `{}` if entry is undefined
- This means it won't break if you forget to pass the entry prop

### 3. Nested Objects
- For nested fields, use dot notation: `'contribution_cta.cta_heading'`
- For arrays, use index: `'value_propositions.0.title'`

### 4. Referenced Entries
- If you have referenced entries (like featured_applications), each reference is its own entry
- You can add edit tags to referenced entries too:
```tsx
{featured_applications.map((app) => (
  <div key={app.uid}>
    <h3 {...getEditTags(app, 'title')}>
      {app.title}
    </h3>
  </div>
))}
```

## Testing Edit Tags

1. Start your dev server: `npm run dev`
2. Go to Contentstack and open an entry in Live Preview
3. Hover over content with edit tags - you should see:
   - Edit buttons appear (small pencil icons)
   - Clicking them takes you to that specific field in the CMS
4. Edit content in CMS - see real-time updates

## Example: Complete Component Update

Here's a complete before/after example:

### Before
```tsx
// page.tsx
<MyComponent title={data.title} />

// MyComponent.tsx
interface Props {
  title: string;
}

export default function MyComponent({ title }: Props) {
  return <h1>{title}</h1>;
}
```

### After
```tsx
// page.tsx
<MyComponent entry={data} title={data.title} />

// MyComponent.tsx
import { getEditTags } from '@/lib/utils';

interface Props {
  entry?: any;
  title: string;
}

export default function MyComponent({ entry, title }: Props) {
  return <h1 {...getEditTags(entry, 'title')}>{title}</h1>;
}
```

## Quick Checklist

For each component that displays Contentstack content:

- [ ] Pass the full `entry` object to the component
- [ ] Add `entry?: any` to the component's props interface
- [ ] Import `getEditTags` from '@/lib/utils'
- [ ] Add `{...getEditTags(entry, 'field_name')}` to HTML elements
- [ ] Use correct field paths (check your content type structure)
- [ ] Test in Live Preview to confirm edit buttons appear

## What's Already Done

✅ All queries updated with `.includeContentType()` and `.includeFallbackLocale()`  
✅ `getEditTags()` helper function created  
✅ HeroSection component updated as example  
✅ Live Preview SDK fully configured

## What You Need to Do

Now you can add edit tags to other components following the examples above. Start with the most important content areas:

1. Homepage sections (ValuePropositions, ContributionCTA)
2. Application cards and detail pages
3. FAQ items
4. Support page content
5. Changelog items

The pattern is always the same: pass entry, use `getEditTags(entry, 'field_path')`.

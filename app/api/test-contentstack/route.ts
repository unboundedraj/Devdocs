import { NextResponse } from 'next/server';
import Stack from '@/lib/contentstack-management';

export async function GET() {
  const results: Record<string, any> = {};

  // Test 1: Can we access the users content type?
  try {
    const contentType = await Stack.contentType('users').fetch();
    results.contentTypeAccess = { success: true, title: contentType?.title };
  } catch (error: any) {
    results.contentTypeAccess = { success: false, error: error?.errorMessage || error?.message };
  }

  // Test 2: Can we query user entries?
  try {
    const query = await Stack.contentType('users').entry().query().find();
    const count = query?.items?.length ?? 0;
    results.entryQuery = { success: true, count };
  } catch (error: any) {
    results.entryQuery = { success: false, error: error?.errorMessage || error?.message };
  }

  // Test 3: Can we query application entries?
  try {
    const apps = await Stack.contentType('application').entry().query().find();
    const first = apps?.items?.[0];
    results.applicationQuery = {
      success: true,
      count: apps?.items?.length ?? 0,
      firstTitle: first?.title,
    };
  } catch (error: any) {
    results.applicationQuery = { success: false, error: error?.errorMessage || error?.message };
  }

  const allPassed = Object.values(results).every((r: any) => r.success);

  return NextResponse.json(
    {
      success: allPassed,
      env: {
        apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
        environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
        managementTokenPresent: !!process.env.CONTENTSTACK_MANAGEMENT_TOKEN,
      },
      results,
    },
    { status: allPassed ? 200 : 500 }
  );
}

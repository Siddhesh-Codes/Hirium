import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    const apiKey = process.env.CLOUDINARY_API_KEY || '';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    // Size limit check (Max 5 MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: 'File exceeds maximum limit of 5 MB. Please upload a smaller document.' },
        { status: 400 }
      );
    }

    // MIME type check
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (file.type && !allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      return NextResponse.json(
        { success: false, message: 'Only PDF, DOC, and DOCX document formats are accepted.' },
        { status: 400 }
      );
    }

    // Generate Cloudinary Secure Signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'hirium/resumes';
    
    // Sort parameters alphabetically as required by Cloudinary signing algorithm
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    // Prepare Cloudinary multipart payload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('timestamp', timestamp.toString());
    cloudinaryFormData.append('signature', signature);
    cloudinaryFormData.append('folder', folder);

    // Upload as auto/raw resource
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const uploadRes = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok || uploadData.error) {
      console.error('Cloudinary Upload Error:', uploadData.error);
      return NextResponse.json(
        { success: false, message: uploadData.error?.message || 'Failed to upload document to Cloudinary.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadData.secure_url || uploadData.url,
      publicId: uploadData.public_id,
      format: uploadData.format,
      bytes: uploadData.bytes,
      originalFilename: file.name,
    });
  } catch (err: any) {
    console.error('Upload handler exception:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal error during document upload.' },
      { status: 500 }
    );
  }
}

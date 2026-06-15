import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { usersStore } from '@/lib/store';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Duplicate email check
    const existing = usersStore.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser: User = {
      id:        `user-${Date.now()}`,
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashed,
      role:      'user',
      phone:     phone?.trim() ?? '',
      createdAt: new Date().toISOString(),
    };

    usersStore.push(newUser);

    // Never return the password hash
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createNewPlayer } from '@/lib/gameLogic';

export async function POST(req: NextRequest) {
  try {
    const { playerName } = await req.json();

    if (!playerName || playerName.trim() === '') {
      return NextResponse.json(
        { error: 'Tên người chơi không hợp lệ' },
        { status: 400 }
      );
    }

    const newPlayer = createNewPlayer(playerName);
    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Lỗi tạo người chơi mới' },
      { status: 500 }
    );
  }
}

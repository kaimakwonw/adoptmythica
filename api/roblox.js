export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username obrigatório' });

  try {
    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
    });
    const userData = await userRes.json();
    if (!userData.data?.length) return res.status(404).json({ error: 'Usuário não encontrado' });

    const user = userData.data[0];
    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=352x352&format=Png&isCircular=true`);
    const avatarData = await avatarRes.json();

    res.status(200).json({
      id: user.id,
      username: user.name,
      avatar: avatarData.data[0]?.imageUrl,
      profile: `https://www.roblox.com/users/${user.id}/profile`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno na função' });
  }
}
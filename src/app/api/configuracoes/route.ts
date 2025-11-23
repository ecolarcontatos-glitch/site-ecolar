import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, executeUpdate } from '@/lib/db';

export async function GET() {
  try {
    console.log('📋 Buscando configurações...');
    
    const configs = await executeQuery(`
      SELECT id, telefone, email, endereco, whatsapp, texto_footer, texto_rodape, 
             hero_images, logo_header, logo_footer, created_at, updated_at
      FROM configuracoes 
      ORDER BY id DESC
      LIMIT 1
    `);

    if (configs.length === 0) {
      console.log('⚠️ Nenhuma configuração encontrada, retornando padrões');
      return NextResponse.json({
        telefone: '(83) 2177-7553',
        email: 'ecolar.contatos@gmail.com',
        endereco: 'R. Pres. Washington Luís, 592 - João Pessoa',
        whatsapp: '558393661690',
        texto_footer: 'Materiais de construção com qualidade e sustentabilidade.',
        texto_rodape: 'Materiais de construção com qualidade e sustentabilidade.',
        hero_images: '[]',
        logo_header: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
        logo_footer: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png'
      });
    }

    const config = configs[0];
    
// Parse seguro do hero_images garantindo que todos os campos existam
if (typeof config.hero_images === 'string') {
  try {
    const parsed = JSON.parse(config.hero_images);

    config.hero_images = Array.isArray(parsed)
      ? parsed.map((b: any) => ({
          desktop: b.desktop || "",
          tablet: b.tablet || "",
          mobile: b.mobile || "",
          link: b.link || "",
          order: b.order || 1
        }))
      : [];
  } catch (e) {
    config.hero_images = [];
  }
}


    console.log('✅ Configurações encontradas');
    return NextResponse.json(config);
  } catch (error) {
    console.error('❌ Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      telefone, email, endereco, whatsapp, texto_footer, texto_rodape,
      hero_images, logo_header, logo_footer 
    } = body;

    console.log('✏️ Atualizando configurações...');

// Validação: garantir que cada banner tenha desktop/tablet/mobile/link
if (Array.isArray(hero_images)) {
  for (const banner of hero_images) {
    if (!banner.desktop || !banner.tablet || !banner.mobile || !banner.link) {
      return NextResponse.json(
        { error: "Cada banner precisa conter desktop, tablet, mobile e link." },
        { status: 400 }
      );
    }
  }
}


console.log("✔ Validação dos banners concluída");

// Verificar se já existe configuração
const existingConfigs = await executeQuery(`
  SELECT id FROM configuracoes ORDER BY id DESC LIMIT 1
`);


// Serializar banners corretamente
const heroImagesJson = JSON.stringify(
  Array.isArray(hero_images)
    ? hero_images.map((b) => ({
        desktop: b.desktop || "",
        tablet: b.tablet || "",
        mobile: b.mobile || "",
        link: b.link || "",
        order: b.order || 1
      }))
    : []
);


    if (existingConfigs.length === 0) {
      // Criar nova configuração
      const result = await executeInsert(`
        INSERT INTO configuracoes (telefone, email, endereco, whatsapp, texto_footer, texto_rodape, 
                                   hero_images, logo_header, logo_footer, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        telefone || '(83) 2177-7553',
        email || 'ecolar.contatos@gmail.com',
        endereco || 'R. Pres. Washington Luís, 592 - João Pessoa',
        whatsapp || '558393661690',
        texto_footer || 'Materiais de construção com qualidade e sustentabilidade.',
        texto_rodape || 'Materiais de construção com qualidade e sustentabilidade.',
        heroImagesJson || '[]',
        logo_header || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
        logo_footer || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png'
      ]);

      console.log(`✅ Configuração criada com ID: ${result.insertId}`);
    } else {
      // Atualizar configuração existente
      const configId = existingConfigs[0].id;
      
      const result = await executeUpdate(`
        UPDATE configuracoes 
        SET telefone = ?, email = ?, endereco = ?, whatsapp = ?, texto_footer = ?, texto_rodape = ?,
            hero_images = ?, logo_header = ?, logo_footer = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        telefone || '(83) 2177-7553',
        email || 'ecolar.contatos@gmail.com',
        endereco || 'R. Pres. Washington Luís, 592 - João Pessoa',
        whatsapp || '558393661690',
        texto_footer || 'Materiais de construção com qualidade e sustentabilidade.',
        texto_rodape || 'Materiais de construção com qualidade e sustentabilidade.',
        heroImagesJson || '[]',
        logo_header || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
        logo_footer || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
        configId
      ]);

      console.log(`✅ Configuração ID ${configId} atualizada com sucesso`);
    }

    return NextResponse.json({
      telefone: telefone || '(83) 2177-7553',
      email: email || 'ecolar.contatos@gmail.com',
      endereco: endereco || 'R. Pres. Washington Luís, 592 - João Pessoa',
      whatsapp: whatsapp || '558393661690',
      texto_footer: texto_footer || 'Materiais de construção com qualidade e sustentabilidade.',
      texto_rodape: texto_rodape || 'Materiais de construção com qualidade e sustentabilidade.',
      hero_images: JSON.parse(heroImagesJson),
      logo_header: logo_header || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
      logo_footer: logo_footer || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
      message: 'Configurações atualizadas com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
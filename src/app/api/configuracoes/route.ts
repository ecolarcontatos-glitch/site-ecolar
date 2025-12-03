import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, executeUpdate } from '@/lib/db';

// Tipagem correta do banner do hero
interface HeroImage {
  desktop: string;
  tablet: string;
  mobile: string;
  link: string;
  order: number;
}

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

    // Caso não exista nenhuma configuração no banco
    if (configs.length === 0) {
      console.log('⚠️ Nenhuma configuração encontrada, retornando padrões');
      return NextResponse.json({
        id: null,
        telefone: '(83) 2177-7553',
        email: 'ecolar.contatos@gmail.com',
        endereco: 'R. Pres. Washington Luís, 592 - João Pessoa',
        whatsapp: '558393661690',
        texto_footer: 'Materiais de construção com qualidade e sustentabilidade.',
        texto_rodape: 'Materiais de construção com qualidade e sustentabilidade.',
        hero_images: [],
        logo_header: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
        logo_footer: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png'
      });
    }

    const config = configs[0];
// Garantir que os banners sejam parseados CORRETAMENTE
let heroImages: HeroImage[] = [];

try {
  const rawHero = config.hero_images;
  let parsed: any[] = [];

  if (Array.isArray(rawHero)) {
    // Caso a coluna seja JSON e o driver já devolva array pronto
    parsed = rawHero;
  } else if (typeof rawHero === "string") {
    // Caso ainda esteja como string JSON
    if (rawHero.trim() === "") {
      parsed = [];
    } else {
      try {
        parsed = JSON.parse(rawHero);
      } catch (e) {
        console.error("❌ Falha ao parsear hero_images (string inválida):", rawHero);
        parsed = [];
      }
    }
  } else if (rawHero == null) {
    parsed = [];
  } else {
    console.warn("⚠ hero_images em formato inesperado:", typeof rawHero, rawHero);
    parsed = [];
  }

  heroImages = Array.isArray(parsed)
    ? parsed.map((b: any): HeroImage => ({
        desktop: b.desktop || "",
        tablet: b.tablet || "",
        mobile: b.mobile || "",
        link: b.link || "",
        order: b.order || 1,
      }))
    : [];
} catch (err) {
  console.error("❌ Erro geral ao processar hero_images:", err);
  heroImages = [];
}


    console.log('✅ Configurações encontradas');

    return NextResponse.json({
      id: config.id,
      telefone: config.telefone,
      email: config.email,
      endereco: config.endereco,
      whatsapp: config.whatsapp,
      texto_footer: config.texto_footer,
      texto_rodape: config.texto_rodape,
      heroImages: heroImages,
      logo_header: config.logo_header,
      logo_footer: config.logo_footer
    });

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
      telefone,
      email,
      endereco,
      whatsapp,
      texto_footer,
      texto_rodape,
      hero_images,     // 👈 É ISSO QUE VEM DO FRONT
      logo_header,
      logo_footer
    } = body;


    console.log('✏️ Atualizando configurações...');

    // Validação de banners
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

    // Serialização correta dos banners
    const heroImagesJson = JSON.stringify(
      Array.isArray(hero_images)
        ? hero_images.map((b: any): HeroImage => ({
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
        heroImagesJson,
        logo_header || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
        logo_footer || 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png'
      ]);

      console.log(`✅ Configuração criada com ID: ${result.insertId}`);

    } else {
      // Atualizar configuração existente
      const configId = existingConfigs[0].id;

      await executeUpdate(`
        UPDATE configuracoes 
        SET telefone = ?, email = ?, endereco = ?, whatsapp = ?, texto_footer = ?, texto_rodape = ?,
            hero_images = ?, logo_header = ?, logo_footer = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        telefone,
        email,
        endereco,
        whatsapp,
        texto_footer,
        texto_rodape,
        heroImagesJson,
        logo_header,
        logo_footer,
        configId
      ]);

      console.log(`✅ Configuração ID ${configId} atualizada com sucesso`);
    }

    return NextResponse.json({
      telefone,
      email,
      endereco,
      whatsapp,
      texto_footer,
      texto_rodape,
      heroImages: JSON.parse(heroImagesJson),
      logo_header,
      logo_footer,
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

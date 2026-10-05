require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

// Landing Page Schema (inline for this script)
const landingPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  sections: [{
    type: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
  }],
  schema: mongoose.Schema.Types.Mixed,
  published: { type: Boolean, default: false }
}, { timestamps: true });

const LandingPage = mongoose.model('LandingPage', landingPageSchema);

async function createTestLandingPage() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if already exists
    const existing = await LandingPage.findOne({ slug: 'ecu-tuning-pro' });
    if (existing) {
      console.log('⚠️  Landing Page با slug "ecu-tuning-pro" از قبل موجود است');
      console.log('ID:', existing._id);
      console.log('عنوان:', existing.title);
      await mongoose.connection.close();
      return;
    }

    const testLandingPage = {
      title: 'تیونینگ حرفه‌ای ECU خودرو',
      slug: 'ecu-tuning-pro',
      category: 'خدمات',
      metaTitle: 'تیونینگ حرفه‌ای ECU - افزایش قدرت و کاهش مصرف سوخت',
      metaDescription: 'با تیونینگ حرفه‌ای ECU خودرو، قدرت موتور را تا 30% افزایش دهید و مصرف سوخت را تا 15% کاهش دهید. خدمات تخصصی رادیف ECU',
      keywords: ['تیونینگ ecu', 'افزایش قدرت موتور', 'کاهش مصرف سوخت', 'رادیف ecu'],
      published: true,
      sections: [
        {
          type: 'hero',
          data: {
            title: 'تیونینگ حرفه‌ای ECU خودرو',
            subtitle: 'قدرت بیشتر، مصرف کمتر، رانندگی لذت‌بخش‌تر',
            imageUrl: '/images/ecu-hero.jpg',
            ctaText: 'رزرو نوبت',
            ctaLink: '/booking',
            bgColor: '#F5F5F5'
          }
        },
        {
          type: 'features',
          data: {
            title: 'چرا تیونینگ ECU؟',
            subtitle: 'مزایای استفاده از خدمات حرفه‌ای ما',
            features: [
              {
                icon: 'zap',
                title: 'افزایش قدرت موتور',
                description: 'تا 30% افزایش توان و گشتاور موتور با کالیبراسیون دقیق'
              },
              {
                icon: 'clock',
                title: 'کاهش مصرف سوخت',
                description: 'بهینه‌سازی مصرف سوخت تا 15% با تنظیمات استاندارد'
              },
              {
                icon: 'shield',
                title: 'ایمنی کامل',
                description: 'تضمین سلامت موتور با رعایت استانداردهای جهانی'
              },
              {
                icon: 'star',
                title: 'کیفیت برتر',
                description: 'استفاده از جدیدترین تجهیزات و نرم‌افزارهای روز دنیا'
              },
              {
                icon: 'award',
                title: 'تجربه 10 ساله',
                description: 'تیم متخصص با سابقه درخشان در صنعت خودرو'
              },
              {
                icon: 'check',
                title: 'گارانتی معتبر',
                description: 'گارانتی کتبی و پشتیبانی پس از انجام خدمات'
              }
            ],
            bgColor: '#FFFFFF'
          }
        },
        {
          type: 'text',
          data: {
            title: 'تیونینگ ECU چیست؟',
            content: '<p>تیونینگ ECU یا بازنویسی نرم‌افزار کامپیوتر خودرو، فرآیندی است که در آن پارامترهای کنترل موتور برای بهبود عملکرد، کاهش مصرف سوخت یا افزایش توان تنظیم می‌شوند.</p><p>این کار به‌صورت نرم‌افزاری و بدون نیاز به تغییرات سخت‌افزاری انجام می‌شود و کاملاً ایمن است.</p>',
            align: 'right',
            bgColor: '#F5F5F5'
          }
        },
        {
          type: 'cta',
          data: {
            title: 'آماده برای ارتقای خودروی خود هستید؟',
            subtitle: 'همین حالا با ما تماس بگیرید و از مشاوره رایگان بهره‌مند شوید',
            primaryCtaText: 'رزرو نوبت',
            primaryCtaLink: '/booking',
            secondaryCtaText: 'تماس با ما',
            secondaryCtaLink: '/contact',
            bgColor: '#252525'
          }
        },
        {
          type: 'testimonials',
          data: {
            title: 'نظرات مشتریان',
            subtitle: 'تجربه واقعی مشتریان ما از خدمات تیونینگ ECU',
            testimonials: [
              {
                name: 'علی محمدی',
                role: 'صاحب پژو 206',
                content: 'بعد از تیونینگ ECU، ماشینم مثل روز اول شده! قدرتش خیلی بیشتر شده و مصرفش هم کمتر.',
                rating: 5
              },
              {
                name: 'رضا احمدی',
                role: 'صاحب سمند EF7',
                content: 'خدمات عالی و حرفه‌ای. تیم فوق‌العاده مسلط و با تجربه. واقعاً راضی هستم.',
                rating: 5
              },
              {
                name: 'حسن کریمی',
                role: 'صاحب پراید 131',
                content: 'قیمت منصفانه و کیفیت بالا. مصرف سوخت کاهش پیدا کرده و قدرتش هم بهتر شده.',
                rating: 4
              }
            ],
            bgColor: '#F5F5F5'
          }
        },
        {
          type: 'faq',
          data: {
            title: 'سوالات متداول',
            subtitle: 'پاسخ به سوالات رایج درباره تیونینگ ECU',
            faqs: [
              {
                question: 'تیونینگ ECU به خودرو آسیب می‌رساند؟',
                answer: 'خیر، تیونینگ حرفه‌ای ECU با رعایت استانداردها و محدودیت‌های فنی انجام می‌شود و نه‌تنها به خودرو آسیب نمی‌رساند، بلکه می‌تواند عمر موتور را با بهینه‌سازی پارامترها افزایش دهد.'
              },
              {
                question: 'آیا گارانتی خودرو باطل می‌شود؟',
                answer: 'اگر خودروی شما تحت گارانتی نمایندگی است، توصیه می‌کنیم ابتدا با نمایندگی مشورت کنید. برای خودروهای خارج از گارانتی، این مشکلی ایجاد نمی‌کند.'
              },
              {
                question: 'مدت زمان انجام تیونینگ چقدر است؟',
                answer: 'بسته به نوع خودرو و نوع تیونینگ، معمولاً بین 2 تا 4 ساعت زمان می‌برد.'
              },
              {
                question: 'آیا می‌توان تیونینگ را برگرداند؟',
                answer: 'بله، ما نسخه اصلی نرم‌افزار ECU شما را ذخیره می‌کنیم و در صورت نیاز می‌توانید به حالت اولیه بازگردید.'
              }
            ],
            bgColor: '#FFFFFF'
          }
        }
      ]
    };

    const landingPage = new LandingPage(testLandingPage);
    await landingPage.save();

    console.log('✅ Landing Page ایجاد شد!');
    console.log('---');
    console.log('ID:', landingPage._id);
    console.log('عنوان:', landingPage.title);
    console.log('Slug:', landingPage.slug);
    console.log('منتشر شده:', landingPage.published ? 'بله' : 'خیر');
    console.log('تعداد بخش‌ها:', landingPage.sections.length);
    console.log('---');
    console.log('🔗 لینک دسترسی: http://localhost:3001/landing/' + landingPage.slug);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ خطا:', error.message);
    process.exit(1);
  }
}

createTestLandingPage();

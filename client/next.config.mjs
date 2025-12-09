/** @type {import('next').NextConfig} */
const nextConfig = {

    async headers() {
        return [
            {
                //网站根路径下所有后缀为 svg/jpg/png 的图片文件
                //缓存有效期 24 小时
                source: '/:all*(svg|jpg|png)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, must-revalidate',
                    }
                ],
            },
        ]
    },
};

export default nextConfig;